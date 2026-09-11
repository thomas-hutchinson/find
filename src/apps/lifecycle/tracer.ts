/**
 * Executes user code with the target candidate wrapped in a tracking Proxy,
 * capturing every read/write/method/iterate/derive as a LifeEvent.
 *
 * This file intentionally duplicates a small tokenizer (comment/string/regex
 * skipping, `if (...)` detection) from parser.ts rather than importing its
 * internals, since parser.ts only exports `parseCode` — the two files stay
 * independently self-contained per the task split.
 */
import type { CandidateKind, CodeParam, Entity, LifeEvent, TraceOptions, TraceResult } from './types'
import { parseCode } from './parser'

// ---------------------------------------------------------------------------
// Minimal tokenizer (duplicated from parser.ts) used only to find and rewrite
// every `if (...)` in the source, regardless of nesting depth.
// ---------------------------------------------------------------------------

function isIdentPart(ch: string): boolean {
  return ch === '_' || ch === '$' || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')
}

function skipLineComment(source: string, i: number): number {
  let j = i + 2
  while (j < source.length && source[j] !== '\n') j++
  return j
}

function skipBlockComment(source: string, i: number): number {
  let j = i + 2
  while (j < source.length && !(source[j] === '*' && source[j + 1] === '/')) j++
  return Math.min(j + 2, source.length)
}

function skipQuoted(source: string, i: number, quote: string): number {
  let j = i + 1
  while (j < source.length) {
    if (source[j] === '\\') {
      j += 2
      continue
    }
    if (source[j] === quote) return j + 1
    j++
  }
  return j
}

function skipTemplate(source: string, i: number): number {
  let j = i + 1
  while (j < source.length) {
    const ch = source[j]
    if (ch === '\\') {
      j += 2
      continue
    }
    if (ch === '`') return j + 1
    if (ch === '$' && source[j + 1] === '{') {
      j = skipBalanced(source, j + 1)
      continue
    }
    j++
  }
  return j
}

function precedingToken(source: string, i: number): string {
  let j = i - 1
  while (j >= 0 && /\s/.test(source[j])) j--
  if (j < 0) return ''
  if (isIdentPart(source[j])) {
    let k = j
    while (k >= 0 && isIdentPart(source[k])) k--
    return source.slice(k + 1, j + 1)
  }
  return source[j]
}

const REGEX_START_TOKENS = new Set(['=', '(', ',', ';', '{', '[', ':', '!', '&', '|', '?', 'return'])

function regexCanStart(source: string, i: number): boolean {
  const tok = precedingToken(source, i)
  return tok === '' || REGEX_START_TOKENS.has(tok)
}

function skipRegex(source: string, i: number): number {
  let j = i + 1
  let inClass = false
  while (j < source.length) {
    const ch = source[j]
    if (ch === '\\') {
      j += 2
      continue
    }
    if (ch === '\n') break
    if (ch === '[') inClass = true
    else if (ch === ']') inClass = false
    else if (ch === '/' && !inClass) {
      j++
      break
    }
    j++
  }
  while (j < source.length && /[a-z]/i.test(source[j])) j++
  return j
}

function skipAtomAt(source: string, i: number): number | null {
  const ch = source[i]
  const next = source[i + 1]
  if (ch === '/' && next === '/') return skipLineComment(source, i)
  if (ch === '/' && next === '*') return skipBlockComment(source, i)
  if (ch === '"' || ch === "'") return skipQuoted(source, i, ch)
  if (ch === '`') return skipTemplate(source, i)
  if (ch === '/' && regexCanStart(source, i)) return skipRegex(source, i)
  return null
}

const OPENERS = '{[('
const CLOSERS = '}])'

function skipBalanced(source: string, start: number): number {
  let depth = 0
  let i = start
  while (i < source.length) {
    const atomEnd = skipAtomAt(source, i)
    if (atomEnd !== null) {
      i = atomEnd
      continue
    }
    const ch = source[i]
    if (OPENERS.includes(ch)) {
      depth++
      i++
      continue
    }
    if (CLOSERS.includes(ch)) {
      depth--
      i++
      if (depth === 0) return i
      continue
    }
    i++
  }
  return i
}

function matchesWordAt(source: string, pos: number, word: string): boolean {
  if (!source.startsWith(word, pos)) return false
  const before = source[pos - 1]
  const after = source[pos + word.length]
  if (before !== undefined && isIdentPart(before)) return false
  if (after !== undefined && isIdentPart(after)) return false
  return true
}

function computeLineStarts(source: string): number[] {
  const starts = [0]
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\n') starts.push(i + 1)
  }
  return starts
}

function lineForOffset(lineStarts: number[], offset: number): number {
  let lo = 0
  let hi = lineStarts.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (lineStarts[mid] <= offset) lo = mid
    else hi = mid - 1
  }
  return lo + 1
}

function peekAfterTrivia(source: string, from: number): { pos: number; ch: string | undefined } {
  let p = from
  while (p < source.length) {
    const ch = source[p]
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      p++
      continue
    }
    if (ch === '/' && source[p + 1] === '/') {
      p = skipLineComment(source, p)
      continue
    }
    if (ch === '/' && source[p + 1] === '*') {
      p = skipBlockComment(source, p)
      continue
    }
    break
  }
  return { pos: p, ch: source[p] }
}

/**
 * Rewrites every `if (COND)` to `((__trace.branch(id, !!(COND)), (COND)))`,
 * a comma expression that preserves semantics while recording the branch id
 * whenever COND is truthy. Ids use the same `b<line>:<col>` scheme as
 * parser.ts, so they match parseCode(originalSource)'s branch ids as long as
 * no param override changes text on the same line as an `if` (the common
 * case — overrides and `if`s normally live on different lines).
 */
function instrumentBranches(source: string): string {
  const lineStarts = computeLineStarts(source)
  let out = ''
  let lastEmit = 0
  let i = 0
  while (i < source.length) {
    const atomEnd = skipAtomAt(source, i)
    if (atomEnd !== null) {
      i = atomEnd
      continue
    }
    const ch = source[i]
    if (ch === 'i' && matchesWordAt(source, i, 'if')) {
      const ifStart = i
      const paren = peekAfterTrivia(source, i + 2)
      if (paren.ch === '(') {
        const parenStart = paren.pos
        const parenEnd = skipBalanced(source, parenStart)
        const condText = source.slice(parenStart + 1, parenEnd - 1)
        const line = lineForOffset(lineStarts, ifStart)
        const col = ifStart - lineStarts[line - 1]
        const id = `b${line}:${col}`
        out += source.slice(lastEmit, parenStart)
        out += `((__trace.branch(${JSON.stringify(id)}, !!(${condText})), (${condText})))`
        lastEmit = parenEnd
        i = parenEnd
        continue
      }
    }
    i++
  }
  out += source.slice(lastEmit)
  return out
}

function applyParamOverrides(source: string, params: CodeParam[], overrides: Record<string, string>): string {
  const edits = params
    .filter((p) => Object.prototype.hasOwnProperty.call(overrides, p.name))
    .sort((a, b) => b.literalStart - a.literalStart)
  let out = source
  for (const p of edits) {
    out = out.slice(0, p.literalStart) + overrides[p.name] + out.slice(p.literalEnd)
  }
  return out
}

// ---------------------------------------------------------------------------
// Deterministic Math/Date shims for the sandbox.
// ---------------------------------------------------------------------------

function createSeededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function makeMathShim(): typeof Math {
  const shim = Object.create(Math) as typeof Math
  Object.defineProperty(shim, 'random', { value: createSeededRandom(1), enumerable: true })
  return shim
}

function makeDateClass(): DateConstructor {
  class FixedDate extends Date {
    constructor(...args: unknown[]) {
      if (args.length === 0) super(0)
      else super(...(args as ConstructorParameters<typeof Date>))
    }
    static now(): number {
      return 0
    }
  }
  return FixedDate as unknown as DateConstructor
}

// ---------------------------------------------------------------------------
// Limit-exceeded sentinel — thrown to unwind out of running user code.
// ---------------------------------------------------------------------------

type LimitError = Error & { traceLimit: true }

function makeLimitError(message: string): LimitError {
  const err = new Error(message) as LimitError
  err.traceLimit = true
  return err
}

function isLimitError(e: unknown): e is LimitError {
  return e instanceof Error && (e as { traceLimit?: unknown }).traceLimit === true
}

// ---------------------------------------------------------------------------
// Tracer state + the `__trace` façade exposed to the sandboxed code.
// ---------------------------------------------------------------------------

interface TracerState {
  events: LifeEvent[]
  entities: Map<string, Entity>
  rawById: Map<string, unknown>
  logs: string[]
  branchesTaken: Set<string>
  entityCounter: number
  maxEvents: number
  timeBudgetMs: number
  startedAt: number
}

function createState(maxEvents: number, timeBudgetMs: number): TracerState {
  return {
    events: [],
    entities: new Map(),
    rawById: new Map(),
    logs: [],
    branchesTaken: new Set(),
    entityCounter: 0,
    maxEvents,
    timeBudgetMs,
    startedAt: Date.now(),
  }
}

interface TraceHandle {
  wrap: (entityId: string, name: string, kind: CandidateKind, value: unknown) => unknown
  branch: (id: string, taken: boolean) => void
  result: () => TraceResult
  math: typeof Math
  dateClass: DateConstructor
  console: { log: (...args: unknown[]) => void }
}

/**
 * Array method categories. Membership in these sets drives how the Proxy's
 * `get` trap dispatches — each category needs different callback / return
 * handling so tracked entities never leak as raw values to user code, and
 * user callbacks always see wrapped items.
 */
const IN_PLACE_MUTATING_METHODS = new Set(['push', 'unshift', 'fill', 'copyWithin'])
const EXTRACTING_METHODS = new Set(['pop', 'shift', 'splice'])
const REVERSING_METHODS = new Set(['reverse'])
const SORT_METHODS = new Set(['sort'])
const CB_ITEM_METHODS = new Set(['forEach', 'find', 'findIndex', 'findLast', 'findLastIndex', 'some', 'every'])
const CB_ITEM_DERIVE_METHODS = new Set(['map', 'filter', 'flatMap'])
const CB_ACC_ITEM_METHODS = new Set(['reduce', 'reduceRight'])
const NO_CB_DERIVE_METHODS = new Set(['slice', 'concat', 'flat'])

function propLabel(prop: string): string {
  return /^\d+$/.test(prop) ? `[${prop}]` : `.${prop}`
}

function joinPath(base: string, prop: string): string {
  return base === '' ? prop : `${base}.${prop}`
}

function callAsFunction(target: unknown, methodName: string, args: unknown[]): unknown {
  const fn = (target as Record<string, unknown>)[methodName] as (...a: unknown[]) => unknown
  return fn.apply(target, args)
}

function createTraceHandle(state: TracerState): TraceHandle {
  const rawByProxy = new WeakMap<object, unknown>()

  function checkLimits(): void {
    if (state.events.length >= state.maxEvents) {
      throw makeLimitError(`stopped after reaching the ${state.maxEvents}-event limit`)
    }
    if (Date.now() - state.startedAt > state.timeBudgetMs) {
      throw makeLimitError(`stopped after exceeding the ${state.timeBudgetMs}ms time budget`)
    }
  }

  function pushEvent(partial: Omit<LifeEvent, 'id' | 'step'>): void {
    checkLimits()
    const step = state.events.length
    state.events.push({ id: `ev${step}`, step, ...partial })
  }

  function snapshot(value: unknown, depth: number, seen: Set<unknown>): unknown {
    if (value === null) return null
    const t = typeof value
    if (t === 'function') {
      const name = (value as { name?: string }).name
      return `[fn ${name || 'anonymous'}]`
    }
    if (t === 'symbol') return (value as symbol).toString()
    if (t !== 'object') return value

    const raw = rawByProxy.get(value as object) ?? value
    if (typeof raw === 'function') {
      const name = (raw as { name?: string }).name
      return `[fn ${name || 'anonymous'}]`
    }
    if (typeof raw !== 'object' || raw === null) return raw as unknown
    if (seen.has(raw)) return '[cyclic]'
    if (depth > 6) return '[deep]'

    seen.add(raw)
    let result: unknown
    if (Array.isArray(raw)) {
      result = raw.map((item) => snapshot(item, depth + 1, seen))
    } else {
      const out: Record<string, unknown> = {}
      for (const key of Object.keys(raw as Record<string, unknown>)) {
        out[key] = snapshot((raw as Record<string, unknown>)[key], depth + 1, seen)
      }
      result = out
    }
    seen.delete(raw)
    return result
  }

  function safeStringify(value: unknown): string {
    if (typeof value === 'string') return value
    if (value === null || value === undefined) return String(value)
    if (typeof value === 'object' || typeof value === 'function') {
      const snap = snapshot(value, 0, new Set())
      try {
        return JSON.stringify(snap) ?? String(snap)
      } catch {
        return String(snap)
      }
    }
    return String(value)
  }

  function previewArgs(args: unknown[]): string {
    return args
      .map((a) => {
        const snap = snapshot(a, 0, new Set())
        try {
          return JSON.stringify(snap) ?? String(snap)
        } catch {
          return String(snap)
        }
      })
      .join(', ')
  }

  function unwrapIfProxy(value: unknown): unknown {
    if (value === null || typeof value !== 'object') return value
    return rawByProxy.has(value) ? rawByProxy.get(value) : value
  }

  function wrapValue(entityId: string, path: string, raw: unknown, entityName: string): unknown {
    if (raw === null || typeof raw !== 'object') return raw
    const proxy = new Proxy(raw, makeHandler(entityId, path, entityName))
    rawByProxy.set(proxy, raw)
    return proxy
  }

  function registerEntity(id: string, name: string, kind: CandidateKind, parentId: string | undefined, raw: unknown): void {
    state.entities.set(id, { id, name, kind, parentId, bornAtStep: state.events.length, finalValue: undefined })
    state.rawById.set(id, raw)
  }

  /** Wrap a callback so its item arg gets a Proxy and any returned Proxy is
   *  unwrapped before the native method sees it (so map/filter don't end up
   *  producing arrays of proxies). */
  function wrapItemCallback(
    entityId: string,
    entityName: string,
    cb: unknown,
    itemArgIndex: number,
    unwrapReturn: boolean,
  ): unknown {
    if (typeof cb !== 'function') return cb
    const fn = cb as (...a: unknown[]) => unknown
    return (...cbArgs: unknown[]) => {
      const item = cbArgs[itemArgIndex]
      const idx = cbArgs[itemArgIndex + 1]
      if (item !== null && typeof item === 'object') {
        const idxPath = typeof idx === 'number' ? String(idx) : ''
        cbArgs[itemArgIndex] = wrapValue(entityId, idxPath, item, entityName)
      }
      const result = fn(...cbArgs)
      return unwrapReturn ? unwrapIfProxy(result) : result
    }
  }

  /** Wrap a sort comparator so both compared elements are proxied. */
  function wrapCompareCallback(entityId: string, entityName: string, cb: unknown): unknown {
    if (typeof cb !== 'function') return cb
    const fn = cb as (a: unknown, b: unknown) => number
    return (a: unknown, b: unknown) => {
      const wa = a !== null && typeof a === 'object' ? wrapValue(entityId, '', a, entityName) : a
      const wb = b !== null && typeof b === 'object' ? wrapValue(entityId, '', b, entityName) : b
      return fn(wa, wb)
    }
  }

  /** Wrap a value that just came out of the target (extracted from pop/shift/
   *  splice, yielded by an iterator) so mutations through it stay tracked. */
  function wrapExtracted(entityId: string, entityName: string, value: unknown): unknown {
    if (value === null || typeof value !== 'object') return value
    return wrapValue(entityId, '', value, entityName)
  }

  function recordMethodEvent(
    entityId: string,
    basePath: string,
    prop: string,
    rawArgs: unknown[],
    target: unknown,
  ): void {
    pushEvent({
      kind: 'method',
      entityId,
      path: basePath,
      detail: `${prop}(${previewArgs(rawArgs)})`,
      value: snapshot(target, 0, new Set()),
      args: rawArgs.map((a) => snapshot(a, 0, new Set())),
    })
  }

  function recordDeriveEvent(
    entityId: string,
    basePath: string,
    prop: string,
    rawArgs: unknown[],
    rawResult: unknown,
    entityName: string,
  ): { newId: string; newName: string } {
    const n = ++state.entityCounter
    const newId = `e${n}`
    const newName = `${entityName}.${prop}(…)#${n}`
    registerEntity(newId, newName, 'array', entityId, rawResult)
    pushEvent({
      kind: 'derive',
      entityId,
      path: basePath,
      detail: `${prop}(${previewArgs(rawArgs)})`,
      value: snapshot(rawResult, 0, new Set()),
      args: rawArgs.map((a) => snapshot(a, 0, new Set())),
      producedId: newId,
    })
    return { newId, newName }
  }

  function makeHandler(entityId: string, basePath: string, entityName: string): ProxyHandler<object> {
    return {
      get(target, prop, _receiver) {
        if (prop === Symbol.iterator) {
          pushEvent({ kind: 'iterate', entityId, path: basePath, detail: 'iterate' })
          const nativeIter = (Reflect.get(target, prop, target) as () => Iterator<unknown>).bind(target)
          return () => {
            const it = nativeIter()
            return {
              next: () => {
                const step = it.next()
                if (step.done) return step
                const wrapped =
                  step.value !== null && typeof step.value === 'object'
                    ? wrapValue(entityId, '', step.value, entityName)
                    : step.value
                return { value: wrapped, done: false }
              },
              return: (v?: unknown) => (typeof it.return === 'function' ? it.return(v) : { value: v, done: true }),
              throw: (e?: unknown) => {
                if (typeof it.throw === 'function') return it.throw(e)
                throw e
              },
              [Symbol.iterator]() {
                return this
              },
            }
          }
        }
        if (prop === Symbol.toPrimitive) {
          pushEvent({ kind: 'iterate', entityId, path: basePath, detail: 'toPrimitive' })
          const fn = Reflect.get(target, prop, target) as unknown
          return typeof fn === 'function' ? (fn as (...a: unknown[]) => unknown).bind(target) : fn
        }
        if (typeof prop === 'symbol') {
          return Reflect.get(target, prop, target) as unknown
        }

        if (Array.isArray(target)) {
          if (IN_PLACE_MUTATING_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              callAsFunction(target, prop, rawArgs)
              recordMethodEvent(entityId, basePath, prop, rawArgs, target)
              return _receiver
            }
          }

          if (EXTRACTING_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              const outcome = callAsFunction(target, prop, rawArgs)
              recordMethodEvent(entityId, basePath, prop, rawArgs, target)
              if (prop === 'splice' && Array.isArray(outcome)) {
                return outcome.map((v) => wrapExtracted(entityId, entityName, v))
              }
              return wrapExtracted(entityId, entityName, outcome)
            }
          }

          if (REVERSING_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              callAsFunction(target, prop, rawArgs)
              recordMethodEvent(entityId, basePath, prop, rawArgs, target)
              return _receiver
            }
          }

          if (SORT_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const wrappedArgs = args.length > 0 ? [wrapCompareCallback(entityId, entityName, args[0])] : []
              const rawArgs = args.map(unwrapIfProxy)
              callAsFunction(target, prop, wrappedArgs)
              recordMethodEvent(entityId, basePath, prop, rawArgs, target)
              return _receiver
            }
          }

          if (CB_ITEM_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              const wrappedArgs =
                args.length > 0 ? [wrapItemCallback(entityId, entityName, args[0], 0, false), ...args.slice(1)] : []
              pushEvent({
                kind: 'iterate',
                entityId,
                path: basePath,
                detail: `${prop}(${previewArgs(rawArgs)})`,
                args: rawArgs.map((a) => snapshot(a, 0, new Set())),
              })
              return callAsFunction(target, prop, wrappedArgs)
            }
          }

          if (CB_ITEM_DERIVE_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              const wrappedArgs =
                args.length > 0 ? [wrapItemCallback(entityId, entityName, args[0], 0, true), ...args.slice(1)] : []
              const rawResult = callAsFunction(target, prop, wrappedArgs)
              const { newId, newName } = recordDeriveEvent(entityId, basePath, prop, rawArgs, rawResult, entityName)
              return wrapValue(newId, '', rawResult, newName)
            }
          }

          if (CB_ACC_ITEM_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              const wrappedArgs =
                args.length > 0 ? [wrapItemCallback(entityId, entityName, args[0], 1, true), ...args.slice(1)] : []
              pushEvent({
                kind: 'iterate',
                entityId,
                path: basePath,
                detail: `${prop}(${previewArgs(rawArgs)})`,
                args: rawArgs.map((a) => snapshot(a, 0, new Set())),
              })
              const rawResult = callAsFunction(target, prop, wrappedArgs)
              return unwrapIfProxy(rawResult)
            }
          }

          if (NO_CB_DERIVE_METHODS.has(prop)) {
            return (...args: unknown[]) => {
              const rawArgs = args.map(unwrapIfProxy)
              const rawResult = callAsFunction(target, prop, rawArgs)
              const { newId, newName } = recordDeriveEvent(entityId, basePath, prop, rawArgs, rawResult, entityName)
              return wrapValue(newId, '', rawResult, newName)
            }
          }
        }

        const raw: unknown = Reflect.get(target, prop, target)
        const path = joinPath(basePath, prop)
        pushEvent({
          kind: 'read',
          entityId,
          path,
          detail: `read ${propLabel(prop)}`,
          value: typeof raw === 'object' && raw !== null ? undefined : snapshot(raw, 0, new Set()),
        })
        if (typeof raw === 'function') return (raw as (...a: unknown[]) => unknown).bind(target)
        if (raw !== null && typeof raw === 'object') return wrapValue(entityId, path, raw, entityName)
        return raw
      },
      set(target, prop, value, _receiver) {
        if (typeof prop === 'symbol') return Reflect.set(target, prop, value, target)
        const rawValue = unwrapIfProxy(value)
        const path = joinPath(basePath, prop)
        const ok = Reflect.set(target, prop, rawValue, target)
        pushEvent({ kind: 'write', entityId, path, detail: `write ${propLabel(prop)}`, value: snapshot(rawValue, 0, new Set()) })
        return ok
      },
      deleteProperty(target, prop) {
        if (typeof prop === 'symbol') return Reflect.deleteProperty(target, prop)
        const path = joinPath(basePath, prop)
        const ok = Reflect.deleteProperty(target, prop)
        pushEvent({ kind: 'delete', entityId, path, detail: `delete ${propLabel(prop)}` })
        return ok
      },
    }
  }

  return {
    wrap(entityId, name, kind, value) {
      registerEntity(entityId, name, kind, undefined, value)
      pushEvent({ kind: 'create', entityId, path: '', detail: `create ${name}`, value: snapshot(value, 0, new Set()) })
      return wrapValue(entityId, '', value, name)
    },
    branch(id, taken) {
      checkLimits()
      if (taken) state.branchesTaken.add(id)
    },
    result() {
      const entities: Entity[] = []
      for (const e of state.entities.values()) {
        entities.push({ ...e, finalValue: snapshot(state.rawById.get(e.id), 0, new Set()) })
      }
      return {
        entities,
        events: state.events,
        branchesTaken: Array.from(state.branchesTaken),
        logs: state.logs,
      }
    },
    math: makeMathShim(),
    dateClass: makeDateClass(),
    console: {
      log(...args: unknown[]) {
        state.logs.push(args.map((a) => safeStringify(a)).join(' '))
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Public entry point.
// ---------------------------------------------------------------------------

export function trace(source: string, opts: TraceOptions): TraceResult {
  const maxEvents = opts.maxEvents ?? 5000
  const timeBudgetMs = opts.timeBudgetMs ?? 250

  const parsed1 = parseCode(source)
  const overridden = applyParamOverrides(source, parsed1.params, opts.paramOverrides ?? {})
  const parsed2 = parseCode(overridden)
  const target = parsed2.candidates.find((c) => c.name === opts.target)

  if (!target) {
    return { entities: [], events: [], branchesTaken: [], logs: [], error: `target "${opts.target}" not found` }
  }

  const wrapped =
    overridden.slice(0, target.initStart) +
    `__trace.wrap(${JSON.stringify('root')}, ${JSON.stringify(target.name)}, ${JSON.stringify(target.kind)}, ` +
    overridden.slice(target.initStart, target.initEnd) +
    ')' +
    overridden.slice(target.initEnd)

  const instrumented = instrumentBranches(wrapped)

  const state = createState(maxEvents, timeBudgetMs)
  const handle = createTraceHandle(state)

  const body =
    "'use strict';\n" +
    'const Math = __trace.math, Date = __trace.dateClass, console = __trace.console;\n' +
    instrumented +
    '\n;return __trace.result();'

  try {
    const fn = new Function('__trace', body) as (t: TraceHandle) => TraceResult
    return fn(handle)
  } catch (e) {
    const message = isLimitError(e) ? e.message : e instanceof Error ? e.message : String(e)
    return { ...handle.result(), error: message }
  }
}

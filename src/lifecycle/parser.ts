/**
 * Hand-rolled top-level scanner for the Object Lifecycle Visualizer.
 * No AST/parser dependency: we track only enough state (a bracket-depth
 * counter plus atom skipping for comments/strings/regex) to find
 * top-level `const|let|var` declarations and `if (...)` conditions
 * anywhere in the source.
 */
import type { Branch, Candidate, CodeParam, ParseResult } from './types'

const OPENERS = '{[('
const CLOSERS = '}])'
const DECL_KEYWORDS = ['const', 'let', 'var'] as const

function isIdentStart(ch: string): boolean {
  return ch === '_' || ch === '$' || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')
}

function isIdentPart(ch: string): boolean {
  return isIdentStart(ch) || (ch >= '0' && ch <= '9')
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

/** Template literals are scanned as one atom; `${…}` interpolations recurse via skipBalanced. */
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

/** Best-effort lookback used only to disambiguate `/` (division vs regex start). */
function precedingToken(source: string, i: number): string {
  let j = i - 1
  while (j >= 0 && (source[j] === ' ' || source[j] === '\t' || source[j] === '\n' || source[j] === '\r')) j--
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

/** Consumes one opaque token (comment/string/template/regex) starting at `i`, or returns null. */
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

/**
 * Assumes `source[start]` is one of `{[(`. Returns the index one past its
 * matching closer, using a plain depth counter (mixed bracket types are
 * never actually mismatched in well-formed JS, so this is safe).
 */
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

function matchDeclKeyword(source: string, pos: number): (typeof DECL_KEYWORDS)[number] | null {
  for (const kw of DECL_KEYWORDS) {
    if (matchesWordAt(source, pos, kw)) return kw
  }
  return null
}

interface LiteralMatch {
  type: 'number' | 'string' | 'boolean'
  end: number
}

const NUMBER_RE = /^-?(?:\d+\.\d*|\.\d+|\d+)(?:[eE][+-]?\d+)?/

function matchLiteral(source: string, pos: number): LiteralMatch | null {
  if (matchesWordAt(source, pos, 'true')) return { type: 'boolean', end: pos + 4 }
  if (matchesWordAt(source, pos, 'false')) return { type: 'boolean', end: pos + 5 }
  const ch = source[pos]
  if (ch === '"' || ch === "'") return { type: 'string', end: skipQuoted(source, pos, ch) }
  const m = NUMBER_RE.exec(source.slice(pos))
  if (m && m[0].length > 0) return { type: 'number', end: pos + m[0].length }
  return null
}

/** A literal is only a pure param value if nothing but a terminator follows it on the same line. */
function isPureLiteralTerminator(source: string, from: number): boolean {
  let p = from
  while (p < source.length && (source[p] === ' ' || source[p] === '\t')) p++
  if (p >= source.length) return true
  const ch = source[p]
  if (ch === '\n' || ch === '\r' || ch === ',' || ch === ';') return true
  if (ch === ')' || ch === ']' || ch === '}') return true
  if (ch === '/' && source[p + 1] === '/') return true
  return false
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

interface Trivia {
  pos: number
  ch: string | undefined
}

/** Skips whitespace and comments (never strings/regex) to find the next significant char. */
function peekAfterTrivia(source: string, from: number): Trivia {
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

export function parseCode(source: string): ParseResult {
  const candidates: Candidate[] = []
  const params: CodeParam[] = []
  const branches: Branch[] = []
  const lineStarts = computeLineStarts(source)
  const lineAt = (offset: number) => lineForOffset(lineStarts, offset)

  let pos = 0
  let depth = 0
  let error: string | undefined

  function skipExpressionValue(): void {
    let localDepth = 0
    while (pos < source.length) {
      const atomEnd = skipAtomAt(source, pos)
      if (atomEnd !== null) {
        pos = atomEnd
        continue
      }
      const ch = source[pos]
      if (localDepth === 0 && (ch === ',' || ch === ';' || ch === '\n')) return
      if (CLOSERS.includes(ch) && localDepth === 0) return
      if (OPENERS.includes(ch)) {
        localDepth++
        pos++
        continue
      }
      if (CLOSERS.includes(ch)) {
        localDepth--
        pos++
        continue
      }
      pos++
    }
  }

  function handleDeclaration(): void {
    while (true) {
      const nameTok = peekAfterTrivia(source, pos)
      pos = nameTok.pos
      if (nameTok.ch === undefined || !isIdentStart(nameTok.ch)) return
      const nameStart = pos
      let p = pos
      while (p < source.length && isIdentPart(source[p])) p++
      const name = source.slice(nameStart, p)
      pos = p
      const bindingLine = lineAt(nameStart)

      const eq = peekAfterTrivia(source, pos)
      if (eq.ch === '=') {
        pos = eq.pos + 1
        const val = peekAfterTrivia(source, pos)
        pos = val.pos
        if (val.ch === '{' || val.ch === '[') {
          const kind = val.ch === '{' ? 'object' : 'array'
          const initStart = pos
          pos = skipBalanced(source, pos)
          candidates.push({ name, kind, line: bindingLine, initStart, initEnd: pos })
        } else {
          const lit = val.ch !== undefined ? matchLiteral(source, pos) : null
          if (lit && isPureLiteralTerminator(source, lit.end)) {
            params.push({
              name,
              type: lit.type,
              original: source.slice(pos, lit.end),
              line: bindingLine,
              literalStart: pos,
              literalEnd: lit.end,
            })
            pos = lit.end
          } else {
            skipExpressionValue()
          }
        }
      }

      const next = peekAfterTrivia(source, pos)
      if (next.ch === ',') {
        pos = next.pos + 1
        continue
      }
      return
    }
  }

  function handleIf(): void {
    const ifStart = pos
    pos += 2
    const paren = peekAfterTrivia(source, pos)
    if (paren.ch !== '(') {
      pos = paren.pos
      return
    }
    const parenStart = paren.pos
    const parenEnd = skipBalanced(source, parenStart)
    const condition = source.slice(parenStart + 1, parenEnd - 1).trim()
    const line = lineAt(ifStart)
    const col = ifStart - lineStarts[line - 1]
    branches.push({ id: `b${line}:${col}`, line, condition })
    pos = parenEnd
  }

  try {
    const maxIterations = source.length * 4 + 100
    let iterations = 0
    while (pos < source.length) {
      iterations++
      if (iterations > maxIterations) {
        error = 'parser stalled on malformed input'
        break
      }
      const startPos = pos
      const atomEnd = skipAtomAt(source, pos)
      if (atomEnd !== null) {
        pos = atomEnd
        continue
      }
      const ch = source[pos]

      if (ch === 'i' && matchesWordAt(source, pos, 'if')) {
        handleIf()
        continue
      }

      if (depth === 0) {
        const kw = matchDeclKeyword(source, pos)
        if (kw) {
          pos += kw.length
          handleDeclaration()
          continue
        }
      }

      if (OPENERS.includes(ch)) {
        depth++
        pos++
        continue
      }
      if (CLOSERS.includes(ch)) {
        depth--
        pos++
        continue
      }
      pos++
      if (pos === startPos) pos++
    }
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  return error ? { candidates, params, branches, error } : { candidates, params, branches }
}

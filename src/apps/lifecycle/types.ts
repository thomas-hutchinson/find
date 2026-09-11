/**
 * Shared types for the Object Lifecycle Visualizer.
 * The parser produces these, the tracer produces these, the UI consumes these.
 * Nothing in here depends on React or the DOM.
 */

// ---------------------------------------------------------------------------
// Parser output
// ---------------------------------------------------------------------------

export type CandidateKind = 'object' | 'array'

/** A top-level `const|let|var IDENT = {…}` or `[…]` the user can target. */
export interface Candidate {
  name: string
  kind: CandidateKind
  /** 1-indexed line of the declaration. */
  line: number
  /** Absolute char offset of the initializer literal's first `{`/`[`. */
  initStart: number
  /** Absolute char offset one past the initializer literal's closing `}`/`]`. */
  initEnd: number
}

/** A top-level `const|let|var IDENT = <primitive>` the user can override. */
export interface CodeParam {
  name: string
  /** JS type of the original literal. */
  type: 'number' | 'string' | 'boolean'
  /** The original source literal, e.g. `42`, `"hi"`, `true`. */
  original: string
  line: number
  /** Absolute offsets of the literal in the source. */
  literalStart: number
  literalEnd: number
}

/** An `if (…)` we let the user peek at. */
export interface Branch {
  /** Unique id (stable across parses of the same source). */
  id: string
  /** 1-indexed line of the `if`. */
  line: number
  /** The stringified condition, e.g. `x > 10`. */
  condition: string
}

export interface ParseResult {
  candidates: Candidate[]
  params: CodeParam[]
  branches: Branch[]
  error?: string
}

// ---------------------------------------------------------------------------
// Tracer output
// ---------------------------------------------------------------------------

/** Every meaningful thing that happens to the target during execution. */
export type EventKind =
  /** Initial creation of the target. */
  | 'create'
  /** A property or index was read. */
  | 'read'
  /** A property or index was written (or added). */
  | 'write'
  /** A property was `delete`'d. */
  | 'delete'
  /** A method was invoked on the target (arrays: push/pop/…; objects rare). */
  | 'method'
  /** The target was iterated over (spread, for-of, Object.keys, JSON.stringify…). */
  | 'iterate'
  /** A method call produced a new value the user probably cares about (map/filter/slice). */
  | 'derive'

export interface LifeEvent {
  id: string
  /** Ordinal, starting at 0. */
  step: number
  kind: EventKind
  /** Which entity this happened to: root name, or a derived entity's id. */
  entityId: string
  /** Property path within the entity, e.g. `"0"`, `"user.name"`, `""` for root. */
  path: string
  /** Human-readable one-liner, e.g. `push({id:2})`, `read .name`. */
  detail: string
  /** Snapshot of the relevant value (a shallow, JSON-safe clone). */
  value?: unknown
  /** Method arguments, JSON-safe. */
  args?: unknown[]
  /** Id of the derived entity produced by this event, when kind === 'derive'. */
  producedId?: string
}

/** A distinct object/array observed during the run (the target or a derivation). */
export interface Entity {
  id: string
  name: string
  kind: CandidateKind
  /** Undefined for the root. */
  parentId?: string
  /** Step at which this entity came into existence. */
  bornAtStep: number
  /** Final JSON-safe snapshot. */
  finalValue: unknown
}

export interface TraceResult {
  entities: Entity[]
  events: LifeEvent[]
  /** Which branches were entered at runtime. */
  branchesTaken: string[]
  /** console.log output, stringified. */
  logs: string[]
  /** Runtime error if the code threw. */
  error?: string
}

// ---------------------------------------------------------------------------
// Runtime knobs the UI passes back into the tracer
// ---------------------------------------------------------------------------

export interface TraceOptions {
  /** Target candidate name. */
  target: string
  /** Overrides for CodeParam values, keyed by param name. Each value is a JS literal source snippet. */
  paramOverrides?: Record<string, string>
  /** Hard cap on events captured, to keep runaway loops safe. */
  maxEvents?: number
  /** Hard cap on wall time, in ms. */
  timeBudgetMs?: number
}

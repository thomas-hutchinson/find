import { useCallback, useEffect, useRef, useState } from 'react'
import { SAMPLE_CODE } from './sample'
import { parseCode } from './parser'
import { trace } from './tracer'
import type { CodeParam, ParseResult, TraceResult } from './types'
import { CodeEditor } from './components/CodeEditor'
import { TargetPicker } from './components/TargetPicker'
import { ParamPanel } from './components/ParamPanel'
import { BranchList } from './components/BranchList'
import { EntityGraph } from './components/EntityGraph'
import { Timeline } from './components/Timeline'
import { LogPanel } from './components/LogPanel'
import './lifecycle.css'

const EMPTY_PARSE: ParseResult = { candidates: [], params: [], branches: [] }

function overridesFromParams(params: CodeParam[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const p of params) out[p.name] = p.original
  return out
}

export default function LifecycleApp() {
  const [source, setSource] = useState(SAMPLE_CODE)
  const [parseResult, setParseResult] = useState<ParseResult>(EMPTY_PARSE)
  const [target, setTarget] = useState<string | undefined>(undefined)
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [traceResult, setTraceResult] = useState<TraceResult | undefined>(undefined)
  const [tracing, setTracing] = useState(false)
  const [hoveredStep, setHoveredStep] = useState<number | undefined>(undefined)
  const [errorDismissed, setErrorDismissed] = useState(false)

  const sourceRef = useRef(source)
  sourceRef.current = source
  const skipNextParseDebounce = useRef(true)

  const runTrace = useCallback((src: string, tgt: string | undefined, ov: Record<string, string>) => {
    if (!tgt) {
      setTraceResult(undefined)
      return
    }
    setTracing(true)
    setErrorDismissed(false)
    window.setTimeout(() => {
      setTraceResult(trace(src, { target: tgt, paramOverrides: ov }))
      setTracing(false)
    }, 0)
  }, [])

  useEffect(() => {
    const result = parseCode(SAMPLE_CODE)
    const firstTarget = result.candidates[0]?.name
    const initOverrides = overridesFromParams(result.params)
    setParseResult(result)
    setTarget(firstTarget)
    setOverrides(initOverrides)
    runTrace(SAMPLE_CODE, firstTarget, initOverrides)
  }, [runTrace])

  useEffect(() => {
    if (skipNextParseDebounce.current) {
      skipNextParseDebounce.current = false
      return
    }
    const handle = window.setTimeout(() => {
      const result = parseCode(source)
      setParseResult(result)
      setTarget((prev) => (prev && result.candidates.some((c) => c.name === prev) ? prev : result.candidates[0]?.name))
      setOverrides((prevOv) => {
        const next: Record<string, string> = {}
        for (const p of result.params) next[p.name] = prevOv[p.name] ?? p.original
        return next
      })
    }, 250)
    return () => window.clearTimeout(handle)
  }, [source])

  const handleTraceClick = useCallback(() => {
    runTrace(sourceRef.current, target, overrides)
  }, [runTrace, target, overrides])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleTraceClick()
      } else if (e.key === 'Escape') {
        setErrorDismissed(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleTraceClick])

  const handleSelectTarget = (name: string) => {
    setTarget(name)
    runTrace(sourceRef.current, name, overrides)
  }

  const handleParamChange = (name: string, literal: string) => {
    const next = { ...overrides, [name]: literal }
    setOverrides(next)
    runTrace(sourceRef.current, target, next)
  }

  const showTraceError = Boolean(traceResult?.error) && !errorDismissed

  return (
    <div className="lc-app">
      <header className="lc-header">
        <h1 className="lc-title">Object Lifecycle Visualizer</h1>
        <button className="lc-trace-btn" type="button" onClick={handleTraceClick} disabled={!target}>
          Trace lifecycle
        </button>
        <div className="lc-status">
          {tracing ? (
            <span className="lc-spinner" aria-label="Tracing">
              <span className="lc-dot" />
              <span className="lc-dot" />
              <span className="lc-dot" />
            </span>
          ) : traceResult && !traceResult.error ? (
            <span className="lc-status-ok">{traceResult.events.length} events</span>
          ) : null}
        </div>
      </header>

      <div className="lc-body">
        <div className="lc-left">
          <CodeEditor value={source} onChange={setSource} />
          {parseResult.error ? <div className="lc-parse-error">{parseResult.error}</div> : null}
          <TargetPicker candidates={parseResult.candidates} selected={target} onSelect={handleSelectTarget} />
          <ParamPanel params={parseResult.params} overrides={overrides} onChange={handleParamChange} />
        </div>

        <div className="lc-right">
          <section className="lc-graph-section">
            <EntityGraph
              entities={traceResult?.entities ?? []}
              events={traceResult?.events ?? []}
              hoveredStep={hoveredStep}
            />
          </section>

          {showTraceError ? <div className="lc-error-banner">{traceResult?.error}</div> : null}

          <section className="lc-timeline-section">
            <Timeline
              events={traceResult?.events ?? []}
              entities={traceResult?.entities ?? []}
              hoveredStep={hoveredStep}
              onHoverStep={setHoveredStep}
            />
          </section>

          <section className="lc-bottom-row">
            <BranchList branches={parseResult.branches} branchesTaken={traceResult?.branchesTaken ?? []} />
            <LogPanel logs={traceResult?.logs ?? []} />
          </section>
        </div>
      </div>
    </div>
  )
}

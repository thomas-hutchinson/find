import { useMemo, useState } from 'react'
import type { Entity, LifeEvent } from '../../lifecycle/types'

interface TimelineProps {
  events: LifeEvent[]
  entities: Entity[]
  hoveredStep: number | undefined
  onHoverStep: (step: number | undefined) => void
}

function preview(value: unknown): string {
  if (value === undefined) return ''
  let json: string
  try {
    json = JSON.stringify(value) ?? String(value)
  } catch {
    return String(value)
  }
  return json.length > 60 ? `${json.slice(0, 60)}…` : json
}

export function Timeline({ events, entities, hoveredStep, onHoverStep }: TimelineProps) {
  const [expandedId, setExpandedId] = useState<string | undefined>(undefined)

  const nameByEntity = useMemo(() => new Map(entities.map((e) => [e.id, e.name])), [entities])
  const colorClassByEntity = useMemo(
    () => new Map(entities.map((e, i) => [e.id, `lc-entity-c${i % 8}`])),
    [entities],
  )

  return (
    <div className="lc-panel lc-timeline">
      <div className="lc-panel-title">Timeline</div>
      {events.length === 0 ? (
        <div className="lc-empty">Run a trace to see events</div>
      ) : (
        <ol className="lc-timeline-list">
          {events.map((ev) => {
            const isHovered = ev.step === hoveredStep
            const isExpanded = expandedId === ev.id
            return (
              <li
                key={ev.id}
                className={`lc-timeline-row lc-kind-${ev.kind}${isHovered ? ' lc-timeline-row-active' : ''}`}
                onMouseEnter={() => onHoverStep(ev.step)}
                onMouseLeave={() => onHoverStep(undefined)}
                onClick={() => setExpandedId(isExpanded ? undefined : ev.id)}
              >
                <span className="lc-timeline-stripe" />
                <span className="lc-timeline-step">{ev.step}</span>
                <span className={`lc-timeline-entity ${colorClassByEntity.get(ev.entityId) ?? ''}`}>
                  {nameByEntity.get(ev.entityId) ?? ev.entityId}
                </span>
                <span className={`lc-badge lc-badge-${ev.kind}`}>{ev.kind}</span>
                <span className="lc-timeline-detail">{ev.detail}</span>
                {ev.value === undefined ? null : isExpanded ? (
                  <pre className="lc-timeline-value-full">{JSON.stringify(ev.value, null, 2)}</pre>
                ) : (
                  <span className="lc-timeline-value">{preview(ev.value)}</span>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

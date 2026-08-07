import { useMemo } from 'react'
import type { Entity, LifeEvent } from '../../lifecycle/types'

interface EntityGraphProps {
  entities: Entity[]
  events: LifeEvent[]
  hoveredStep: number | undefined
}

const NODE_W = 132
const NODE_H = 42
const COL_GAP = 84
const ROW_GAP = 20
const PAD = 20

interface LaidOutNode {
  entity: Entity
  x: number
  y: number
}

interface Layout {
  nodes: LaidOutNode[]
  width: number
  height: number
}

function opNameFromDetail(detail: string): string {
  const m = detail.match(/^([A-Za-z_$][\w$]*)\(/)
  return m ? m[1] : detail
}

/** BFS-by-parent depth: root entities sit in column 0, derivations flow right. */
function layout(entities: Entity[]): Layout {
  const byId = new Map(entities.map((e) => [e.id, e]))
  const levelOf = new Map<string, number>()

  function depthOf(id: string, seen: Set<string>): number {
    const cached = levelOf.get(id)
    if (cached !== undefined) return cached
    const entity = byId.get(id)
    if (!entity?.parentId || seen.has(id)) {
      levelOf.set(id, 0)
      return 0
    }
    seen.add(id)
    const d = depthOf(entity.parentId, seen) + 1
    levelOf.set(id, d)
    return d
  }

  entities.forEach((e) => depthOf(e.id, new Set()))

  const maxLevel = entities.reduce((m, e) => Math.max(m, levelOf.get(e.id) ?? 0), 0)
  const columns: Entity[][] = Array.from({ length: maxLevel + 1 }, () => [])
  entities.forEach((e) => columns[levelOf.get(e.id) ?? 0].push(e))

  const nodes: LaidOutNode[] = []
  let maxRows = 1
  columns.forEach((col, level) => {
    maxRows = Math.max(maxRows, col.length)
    col.forEach((entity, row) => {
      nodes.push({
        entity,
        x: PAD + level * (NODE_W + COL_GAP),
        y: PAD + row * (NODE_H + ROW_GAP),
      })
    })
  })

  const width = PAD * 2 + (maxLevel + 1) * NODE_W + maxLevel * COL_GAP
  const height = PAD * 2 + maxRows * NODE_H + (maxRows - 1) * ROW_GAP
  return { nodes, width: Math.max(width, 320), height: Math.max(height, 140) }
}

export function EntityGraph({ entities, events, hoveredStep }: EntityGraphProps) {
  const { nodes, width, height } = useMemo(() => layout(entities), [entities])
  const posById = useMemo(() => new Map(nodes.map((n) => [n.entity.id, n])), [nodes])

  const hoveredEvent = hoveredStep === undefined ? undefined : events.find((e) => e.step === hoveredStep)
  const activeEntityId = hoveredEvent?.entityId
  const activeProducedId = hoveredEvent?.producedId

  const edges = useMemo(() => events.filter((e) => e.kind === 'derive' && e.producedId), [events])

  if (entities.length === 0) {
    return (
      <div className="lc-panel lc-graph">
        <div className="lc-panel-title">Entity graph</div>
        <div className="lc-empty">Run a trace to see entities</div>
      </div>
    )
  }

  return (
    <div className="lc-panel lc-graph">
      <div className="lc-panel-title">Entity graph</div>
      <div className="lc-graph-scroll">
        <svg className="lc-graph-svg" viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
          {edges.map((e) => {
            const from = posById.get(e.entityId)
            const to = e.producedId ? posById.get(e.producedId) : undefined
            if (!from || !to) return null
            const x1 = from.x + NODE_W
            const y1 = from.y + NODE_H / 2
            const x2 = to.x
            const y2 = to.y + NODE_H / 2
            const midX = (x1 + x2) / 2
            const active = hoveredEvent?.id === e.id
            return (
              <g key={e.id} className={`lc-edge${active ? ' lc-edge-active' : ''}`}>
                <path d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`} />
                <text x={midX} y={(y1 + y2) / 2 - 6} textAnchor="middle">
                  {opNameFromDetail(e.detail)}
                </text>
              </g>
            )
          })}
          {nodes.map(({ entity, x, y }) => {
            const active = entity.id === activeEntityId || entity.id === activeProducedId
            const derived = Boolean(entity.parentId)
            return (
              <g
                key={entity.id}
                className={`lc-node${derived ? ' lc-node-derived' : ''}${active ? ' lc-node-active' : ''}`}
                transform={`translate(${x},${y})`}
              >
                <rect width={NODE_W} height={NODE_H} rx={8} />
                <text x={10} y={17} className="lc-node-name">
                  {entity.name}
                </text>
                <text x={10} y={32} className="lc-node-kind">
                  {entity.kind}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

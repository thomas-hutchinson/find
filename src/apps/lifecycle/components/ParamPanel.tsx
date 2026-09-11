import type { CodeParam } from '../types'

interface ParamPanelProps {
  params: CodeParam[]
  overrides: Record<string, string>
  onChange: (name: string, literal: string) => void
}

function displayValue(param: CodeParam, raw: string): string | number | boolean {
  if (param.type === 'number') {
    const n = Number(raw)
    return Number.isNaN(n) ? 0 : n
  }
  if (param.type === 'boolean') return raw === 'true'
  const match = raw.match(/^["'`]([\s\S]*)["'`]$/)
  return match ? match[1] : raw
}

export function ParamPanel({ params, overrides, onChange }: ParamPanelProps) {
  return (
    <div className="lc-panel lc-param-panel">
      <div className="lc-panel-title">Parameters</div>
      {params.length === 0 ? (
        <div className="lc-empty">No top-level constants found</div>
      ) : (
        <div className="lc-param-list">
          {params.map((p) => {
            const raw = overrides[p.name] ?? p.original
            const value = displayValue(p, raw)
            return (
              <label key={p.name} className="lc-param-row">
                <span className="lc-param-name">{p.name}</span>
                {p.type === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) => onChange(p.name, String(e.target.checked))}
                  />
                ) : p.type === 'number' ? (
                  <input
                    type="number"
                    value={value as number}
                    onChange={(e) => onChange(p.name, e.target.value === '' ? '0' : e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => onChange(p.name, JSON.stringify(e.target.value))}
                  />
                )}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

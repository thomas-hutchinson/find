import type { Candidate } from '../../lifecycle/types'

interface TargetPickerProps {
  candidates: Candidate[]
  selected: string | undefined
  onSelect: (name: string) => void
}

export function TargetPicker({ candidates, selected, onSelect }: TargetPickerProps) {
  return (
    <div className="lc-panel lc-target-picker">
      <div className="lc-panel-title">Target</div>
      {candidates.length === 0 ? (
        <div className="lc-empty">No top-level object or array found</div>
      ) : (
        <div className="lc-pill-row">
          {candidates.map((c) => (
            <button
              key={c.name}
              type="button"
              className={`lc-pill${selected === c.name ? ' lc-pill-selected' : ''}`}
              onClick={() => onSelect(c.name)}
            >
              <span className="lc-pill-name">{c.name}</span>
              <span className="lc-pill-kind">{c.kind}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

import type { Branch } from '../../lifecycle/types'

interface BranchListProps {
  branches: Branch[]
  branchesTaken: string[]
}

export function BranchList({ branches, branchesTaken }: BranchListProps) {
  return (
    <div className="lc-panel lc-branch-list">
      <div className="lc-panel-title">Branches</div>
      {branches.length === 0 ? (
        <div className="lc-empty">No if-branches found</div>
      ) : (
        <ul className="lc-branch-items">
          {branches.map((b) => {
            const taken = branchesTaken.includes(b.id)
            return (
              <li key={b.id} className="lc-branch-item">
                <span className={`lc-badge ${taken ? 'lc-badge-taken' : 'lc-badge-skipped'}`}>
                  {taken ? 'taken' : 'skipped'}
                </span>
                <span className="lc-branch-line">L{b.line}</span>
                <code className="lc-branch-cond">{b.condition}</code>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

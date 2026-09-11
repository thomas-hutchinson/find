import { LocateIcon } from './Icons'

interface LocateFabProps {
  onClick: () => void
  disabled?: boolean
  /** Lifts the FAB above the bottom sheet on phones. */
  bottomOffset: number
}

export function LocateFab({ onClick, disabled, bottomOffset }: LocateFabProps) {
  return (
    <button
      className="locate-fab"
      style={{ bottom: bottomOffset }}
      aria-label="Centre map on me"
      disabled={disabled}
      onClick={onClick}
    >
      <LocateIcon size={24} />
    </button>
  )
}

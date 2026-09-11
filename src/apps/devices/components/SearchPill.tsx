import { useRef } from 'react'
import { CloseIcon, SearchIcon } from './Icons'

interface SearchPillProps {
  value: string
  onChange: (v: string) => void
  /** Tablet rail uses the always-expanded block form. */
  block?: boolean
}

export function SearchPill({ value, onChange, block }: SearchPillProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const filled = value.trim().length > 0
  return (
    <div className={`searchpill${block ? ' searchpill--block' : ''}${filled ? ' searchpill--filled' : ''}`}>
      <button
        className="searchpill__icon"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => inputRef.current?.focus()}
      >
        <SearchIcon size={20} />
      </button>
      <input
        ref={inputRef}
        className="searchpill__input"
        value={value}
        placeholder="Search"
        aria-label="Search devices"
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
      />
      {filled && (
        <button
          className="searchpill__clear"
          aria-label="Clear search"
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  )
}

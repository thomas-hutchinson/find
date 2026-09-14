import type { LogEntry } from '../compose'

/*
 * The Site's console output, surfaced in the app.
 *
 * A phone has no devtools, so without this a broken script just makes Run
 * appear to do nothing. Errors are the reason this exists, but console.log is
 * forwarded too — it is how people debug, and telling them to open a console
 * they do not have is no help.
 */

interface Props {
  entries: LogEntry[]
  open: boolean
  onToggle: () => void
  onClear: () => void
}

export function Console({ entries, open, onToggle, onClear }: Props) {
  if (entries.length === 0) return null
  const errors = entries.filter((e) => e.level === 'error').length

  return (
    <div className={`st-console${open ? ' st-console--open' : ''}`}>
      <div className="st-console__bar">
        <button
          type="button"
          className="st-console__toggle"
          onClick={onToggle}
          aria-expanded={open}
        >
          <span className={`st-console__chev${open ? ' st-console__chev--open' : ''}`}>›</span>
          Console
          <span className="st-console__count">{entries.length}</span>
          {errors > 0 && (
            <span className="st-console__errors">
              {errors} error{errors === 1 ? '' : 's'}
            </span>
          )}
        </button>
        {open && (
          <button type="button" className="st-console__clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      {open && (
        <ul className="st-console__lines">
          {entries.map((e) => (
            <li key={e.id} className={`st-console__line st-console__line--${e.level}`}>
              {e.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

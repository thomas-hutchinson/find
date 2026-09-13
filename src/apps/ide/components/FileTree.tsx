import { useMemo, useState } from 'react'

/*
 * The file picker.
 *
 * A flat list grouped by directory rather than a nested tree with disclosure
 * triangles: on a phone, tapping open four levels of nesting to reach
 * `src/apps/devices/components/DeviceRow.tsx` is slow and the triangles are
 * small targets. A filter box reaches any file in two or three keystrokes.
 */

interface Props {
  paths: string[]
  current: string
  dirty: (path: string) => boolean
  onPick: (path: string) => void
}

function dirOf(path: string): string {
  const i = path.lastIndexOf('/')
  return i === -1 ? '/' : path.slice(0, i)
}

function baseOf(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1)
}

export function FileTree({ paths, current, dirty, onPick }: Props) {
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matched = q ? paths.filter((p) => p.toLowerCase().includes(q)) : paths
    const byDir = new Map<string, string[]>()
    for (const p of matched) {
      const d = dirOf(p)
      const list = byDir.get(d)
      if (list) list.push(p)
      else byDir.set(d, [p])
    }
    return [...byDir.entries()]
  }, [paths, query])

  return (
    <div className="ide-tree">
      <div className="ide-tree__search">
        <input
          className="ide-tree__input"
          type="search"
          inputMode="search"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Filter files"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter files"
        />
      </div>

      <div className="ide-tree__scroll">
        {groups.length === 0 && <p className="ide-tree__empty">No files match “{query}”.</p>}
        {groups.map(([dir, items]) => (
          <section key={dir} className="ide-tree__group">
            <h3 className="ide-tree__dir">{dir}</h3>
            {items.map((path) => (
              <button
                key={path}
                type="button"
                className={`ide-tree__file${path === current ? ' ide-tree__file--on' : ''}`}
                onClick={() => onPick(path)}
                aria-current={path === current || undefined}
              >
                <span className="ide-tree__name">{baseOf(path)}</span>
                {dirty(path) && <span className="ide-tree__dot" aria-label="Edited" />}
              </button>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

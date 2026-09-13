import { useCallback, useRef, useState, useSyncExternalStore } from 'react'
import type { EditorView } from '@codemirror/view'
import { Editor } from './components/Editor'
import { FileTree } from './components/FileTree'
import { KeyBar } from './components/KeyBar'
import { useKeyboardInset } from './hooks/useKeyboardInset'
import {
  exportPatch,
  getSnapshot,
  isDirty,
  paths,
  read,
  revert,
  revertAll,
  snapshotTakenAt,
  subscribe,
  write,
} from './workspace'

/*
 * A small IDE for reading and editing this project on a phone.
 *
 * Edits are local-only and live in localStorage: there is no backend and no
 * token, so work leaves the device as a patch you copy or download. Editing the
 * source here does not change the running app — the files are a snapshot taken
 * when the site was built.
 */

const OPEN_KEY = 'find.ide.open.v1'

function initialPath(): string {
  try {
    const saved = localStorage.getItem(OPEN_KEY)
    if (saved && paths.includes(saved)) return saved
  } catch {
    // Storage blocked; fall through to the default.
  }
  return paths.includes('README.md') ? 'README.md' : (paths[0] ?? '')
}

export default function IdeApp() {
  const edits = useSyncExternalStore(subscribe, getSnapshot)
  const [path, setPath] = useState(initialPath)
  const [drawer, setDrawer] = useState(false)
  const [menu, setMenu] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [view, setView] = useState<EditorView | null>(null)

  const root = useRef<HTMLDivElement>(null)
  useKeyboardInset(root)

  const dirtyCount = Object.keys(edits).length
  const fileDirty = path in edits

  const pick = useCallback((next: string) => {
    setPath(next)
    setDrawer(false)
    try {
      localStorage.setItem(OPEN_KEY, next)
    } catch {
      // Not worth surfacing: the file is open either way.
    }
  }, [])

  const flash = (message: string) => {
    setNote(message)
    setMenu(false)
    window.setTimeout(() => setNote(null), 2400)
  }

  const copyPatch = async () => {
    const patch = exportPatch()
    if (!patch) return flash('Nothing edited yet.')
    try {
      await navigator.clipboard.writeText(patch)
      flash(`Copied a patch for ${dirtyCount} file${dirtyCount === 1 ? '' : 's'}.`)
    } catch {
      flash('Clipboard blocked — use Download instead.')
    }
  }

  const downloadPatch = () => {
    const patch = exportPatch()
    if (!patch) return flash('Nothing edited yet.')
    const url = URL.createObjectURL(new Blob([patch], { type: 'text/x-patch' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'find.patch'
    a.click()
    URL.revokeObjectURL(url)
    flash('Patch downloaded.')
  }

  return (
    <div className="ide-app" ref={root}>
      <header className="ide-bar">
        <button
          type="button"
          className="ide-bar__btn"
          onClick={() => setDrawer((d) => !d)}
          aria-label="Files"
          aria-expanded={drawer}
        >
          ☰
        </button>

        <div className="ide-bar__file">
          <span className="ide-bar__path">{path || 'No file'}</span>
          {fileDirty && <span className="ide-bar__dot" aria-label="Edited" />}
        </div>

        <button
          type="button"
          className="ide-bar__btn"
          onClick={() => setMenu((m) => !m)}
          aria-label="Actions"
          aria-expanded={menu}
        >
          ⋯
        </button>

        {menu && (
          <>
            <div className="ide-scrim" onClick={() => setMenu(false)} />
            <div className="ide-menu" role="menu">
              <button
                type="button"
                role="menuitem"
                disabled={!fileDirty}
                onClick={() => { revert(path); flash('Reverted this file.') }}
              >
                Revert this file
              </button>
              <button type="button" role="menuitem" disabled={dirtyCount === 0} onClick={copyPatch}>
                Copy patch{dirtyCount > 0 && ` (${dirtyCount})`}
              </button>
              <button
                type="button"
                role="menuitem"
                disabled={dirtyCount === 0}
                onClick={downloadPatch}
              >
                Download patch
              </button>
              <button
                type="button"
                role="menuitem"
                className="ide-menu__danger"
                disabled={dirtyCount === 0}
                onClick={() => { revertAll(); flash('All edits reverted.') }}
              >
                Revert all edits
              </button>
              <p className="ide-menu__note">
                Edits stay on this device. Snapshot taken{' '}
                {new Date(snapshotTakenAt).toLocaleDateString()}.
              </p>
            </div>
          </>
        )}
      </header>

      <div className="ide-body">
        {drawer && <div className="ide-scrim ide-scrim--drawer" onClick={() => setDrawer(false)} />}
        <aside className={`ide-side${drawer ? ' ide-side--open' : ''}`}>
          <FileTree paths={paths} current={path} dirty={isDirty} onPick={pick} />
        </aside>

        <main className="ide-main">
          {path ? (
            <Editor
              path={path}
              initialText={read(path)}
              onChange={(text) => write(path, text)}
              onReady={setView}
            />
          ) : (
            <p className="ide-empty">No files in the snapshot.</p>
          )}
        </main>
      </div>

      <KeyBar view={view} />

      {note && <div className="ide-toast" role="status">{note}</div>}
    </div>
  )
}

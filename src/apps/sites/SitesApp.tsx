import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { EditorView } from '@codemirror/view'
import { Console } from './components/Console'
import { Editor } from './components/Editor'
import { KeyBar } from './components/KeyBar'
import { Preview } from './components/Preview'
import { SiteList } from './components/SiteList'
import { FILES, type FileKind } from './files'
import { compose, download, isPreviewMessage, type LogEntry } from './compose'
import { useKeyboardInset } from './hooks/useKeyboardInset'
import * as store from './store'

/*
 * Sites — author a small static page and run it.
 *
 * The preview updates only when you press Run, never as you type. A Site can
 * run scripts, so re-rendering on every keystroke means `while (true) {}` hangs
 * the frame on every keystroke — and browsers do not reliably isolate a
 * sandboxed srcdoc iframe into its own process, so it can take the tab with it.
 */

export default function SitesApp() {
  const { sites, storage } = useSyncExternalStore(store.subscribe, store.getSnapshot)
  const [openId, setOpenId] = useState<string | null>(null)
  const [kind, setKind] = useState<FileKind>('html')
  const [pane, setPane] = useState<'edit' | 'preview'>('edit')
  const [doc, setDoc] = useState<string | null>(null)
  const [runKey, setRunKey] = useState(0)
  const [view, setView] = useState<EditorView | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [consoleOpen, setConsoleOpen] = useState(false)
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const logId = useRef(0)

  const root = useRef<HTMLDivElement>(null)
  useKeyboardInset(root)

  useEffect(() => {
    void store.start()
    // The Shell unmounts an App on leave, so queued saves must be written out
    // rather than lost with the component.
    return () => store.flush()
  }, [])

  // Above the tablet breakpoint both panes are on screen and the Preview tab is
  // hidden, so "preview" stops being a meaningful mode. Without this, rotating
  // a tablet from portrait to landscape while previewing leaves no file tab
  // looking selected. 880px is the workbench's breakpoint convention.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 880px)')
    const sync = () => {
      if (mq.matches) setPane('edit')
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // A Site's console output arrives by postMessage from the sandboxed frame.
  // The frame's origin is the string "null", so identity comes from the source
  // window instead — see isPreviewMessage.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isPreviewMessage(event, frameRef.current)) return
      const { level, text } = event.data
      setLogs((prev) => {
        const next = [...prev, { id: (logId.current += 1), level, text }]
        // A runaway loop can log thousands of lines; keep the tail.
        return next.length > 200 ? next.slice(-200) : next
      })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const site = openId ? sites.find((s) => s.id === openId) : undefined

  const run = useCallback(() => {
    if (!site) return
    setLogs([])
    setDoc(compose(site, { instrument: true }))
    setRunKey((k) => k + 1)
  }, [site])

  // Run once when a Site is opened, so the preview is never blank on arrival.
  const openedRef = useRef<string | null>(null)
  useEffect(() => {
    if (site && openedRef.current !== site.id) {
      openedRef.current = site.id
      setLogs([])
      setDoc(compose(site, { instrument: true }))
      setRunKey((k) => k + 1)
    }
    if (!site) openedRef.current = null
  }, [site])

  if (!site) {
    return (
      <div className="st-app" ref={root}>
        <SiteList
          sites={sites}
          storage={storage}
          onOpen={(id) => {
            setOpenId(id)
            setKind('html')
            setPane('edit')
          }}
          onCreate={() => {
            const created = store.create()
            setOpenId(created.id)
            setKind('html')
            setPane('edit')
          }}
          onRename={(id, name) => store.update(id, { name })}
          onDelete={(id) => store.remove(id)}
        />
      </div>
    )
  }

  return (
    <div className={`st-app st-app--editing st-app--${pane}`} ref={root}>
      <header className="st-bar">
        <button
          type="button"
          className="st-bar__back"
          onClick={() => {
            store.flush()
            setOpenId(null)
          }}
          aria-label="All sites"
          data-tip="All sites"
        >
          ‹
        </button>
        <span className="st-bar__name">{site.name}</span>
        <button
          type="button"
          className="st-btn"
          onClick={() => download(site)}
          aria-label="Download this site"
          data-tip="Download as a single .html file"
          data-tip-align="end"
        >
          <span className="st-btn__icon" aria-hidden>
            ↓
          </span>
          <span className="st-btn__label">Download</span>
        </button>
        {/* Only where there is no Preview tab to press. Below the tablet
            breakpoint the Preview tab runs the Site itself, so a separate Run
            button would be a second control for one action. */}
        <button
          type="button"
          className="st-run"
          onClick={run}
          data-tip="Re-run this site"
          data-tip-align="end"
        >
          Run
        </button>
      </header>

      <nav className="st-tabs" role="tablist" aria-label="Files">
        {FILES.map((f) => (
          <button
            key={f.kind}
            type="button"
            role="tab"
            // On a phone the preview is a mode, so a file tab is only the
            // selected tab while the edit pane is the one on screen.
            aria-selected={kind === f.kind && pane === 'edit'}
            className={`st-tab${kind === f.kind && pane === 'edit' ? ' st-tab--on' : ''}`}
            onClick={() => {
              setKind(f.kind)
              setPane('edit')
            }}
          >
            {f.label}
          </button>
        ))}
        {/* Phone only: the preview is a mode, not a pane. Below 880px there is
            not enough height to split once the keyboard is up. */}
        <button
          type="button"
          className={`st-tab st-tab--preview${pane === 'preview' ? ' st-tab--on' : ''}`}
          // Runs every time, including when Preview is already showing, so it
          // doubles as the re-run control on phones.
          onClick={() => {
            run()
            setPane('preview')
          }}
        >
          Preview
        </button>
      </nav>

      <div className="st-panes">
        <div className="st-pane st-pane--edit">
          <Editor
            kind={kind}
            siteId={site.id}
            initialText={site[kind]}
            onChange={(text) => store.update(site.id, { [kind]: text })}
            onReady={setView}
          />
          <KeyBar view={view} />
        </div>
        <div className="st-pane st-pane--preview">
          <Preview
            doc={doc}
            runKey={runKey}
            frameRef={(el) => {
              frameRef.current = el
            }}
          />
          <Console
            entries={logs}
            open={consoleOpen}
            onToggle={() => setConsoleOpen((o) => !o)}
            onClear={() => setLogs([])}
          />
        </div>
      </div>
    </div>
  )
}

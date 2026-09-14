import type { EditorView } from '@codemirror/view'
import { indentMore, redo, undo } from '@codemirror/commands'

/*
 * Symbols phone keyboards bury, plus undo/redo since there is no Cmd+Z.
 * Weighted towards markup and CSS rather than the IDE's TypeScript-leaning set.
 */
const KEYS = ['<', '>', '/', '=', '"', "'", '{', '}', '(', ')', '[', ']', ';', ':', '-', '.', '#', '$', '`', '!']

export function KeyBar({ view }: { view: EditorView | null }) {
  const act = (fn: () => void) => (e: React.PointerEvent) => {
    // pointerdown, not click: a click blurs the editor first and the phone
    // keyboard closes on every tap.
    e.preventDefault()
    if (!view) return
    fn()
    view.focus()
  }

  const insert = (text: string) => () => {
    if (!view) return
    const { from, to } = view.state.selection.main
    view.dispatch({
      changes: { from, to, insert: text },
      selection: { anchor: from + text.length },
      scrollIntoView: true,
    })
  }

  return (
    <div className="st-keybar" role="toolbar" aria-label="Symbols">
      <button type="button" className="st-key st-key--fn" aria-label="Undo" onPointerDown={act(() => view && undo(view))}>↶</button>
      <button type="button" className="st-key st-key--fn" aria-label="Redo" onPointerDown={act(() => view && redo(view))}>↷</button>
      <button type="button" className="st-key st-key--fn" aria-label="Indent" onPointerDown={act(() => view && indentMore(view))}>⇥</button>
      <span className="st-key__sep" />
      {KEYS.map((k) => (
        <button key={k} type="button" className="st-key" aria-label={`Insert ${k}`} onPointerDown={act(insert(k))}>
          {k}
        </button>
      ))}
    </div>
  )
}

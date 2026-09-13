import type { EditorView } from '@codemirror/view'
import { indentMore, redo, undo } from '@codemirror/commands'

/*
 * The symbol row.
 *
 * Phone keyboards bury braces, brackets and angle brackets two layers deep, and
 * there is no Cmd+Z. Writing TypeScript without this is miserable, so it sits
 * directly above the keyboard and inserts at the cursor.
 */

const KEYS = [
  '{', '}', '(', ')', '[', ']', '<', '>', '/', '=', ';', ':', '.', ',',
  "'", '"', '`', '$', '_', '-', '+', '|', '&', '!', '?', '*', '#', '@',
]

interface Props {
  view: EditorView | null
}

export function KeyBar({ view }: Props) {
  const insert = (text: string) => {
    if (!view) return
    const { from, to } = view.state.selection.main
    view.dispatch({
      changes: { from, to, insert: text },
      selection: { anchor: from + text.length },
      scrollIntoView: true,
    })
    // Keep focus so the keyboard does not dismiss between taps.
    view.focus()
  }

  const run = (cmd: (v: EditorView) => boolean) => {
    if (!view) return
    cmd(view)
    view.focus()
  }

  return (
    <div className="ide-keybar" role="toolbar" aria-label="Code symbols">
      <button
        type="button"
        className="ide-keybar__key ide-keybar__key--wide"
        aria-label="Undo"
        // Pointer-down rather than click: a click would blur the editor first
        // and the phone keyboard would close on every tap.
        onPointerDown={(e) => { e.preventDefault(); run(undo) }}
      >
        ↶
      </button>
      <button
        type="button"
        className="ide-keybar__key ide-keybar__key--wide"
        aria-label="Redo"
        onPointerDown={(e) => { e.preventDefault(); run(redo) }}
      >
        ↷
      </button>
      <button
        type="button"
        className="ide-keybar__key ide-keybar__key--wide"
        aria-label="Indent"
        onPointerDown={(e) => { e.preventDefault(); run(indentMore) }}
      >
        ⇥
      </button>
      <span className="ide-keybar__sep" />
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          className="ide-keybar__key"
          aria-label={`Insert ${k}`}
          onPointerDown={(e) => { e.preventDefault(); insert(k) }}
        >
          {k}
        </button>
      ))}
    </div>
  )
}

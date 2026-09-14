import { useEffect, useRef } from 'react'
import { EditorState, type Extension } from '@codemirror/state'
import { EditorView, highlightActiveLine, keymap, lineNumbers } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import {
  HighlightStyle,
  bracketMatching,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { javascript } from '@codemirror/lang-javascript'
import { css as cssLang } from '@codemirror/lang-css'
import { html as htmlLang } from '@codemirror/lang-html'
import { tags as t } from '@lezer/highlight'
import type { FileKind } from '../files'

/*
 * Sites' editing surface.
 *
 * Deliberately a separate copy from the IDE's rather than a shared module: Apps
 * import nothing from each other, and these two diverge on purpose — the IDE
 * reads a fixed repository snapshot, this one authors new content. CodeMirror
 * itself is not duplicated on the wire; Rollup hoists a dependency shared by
 * two lazy chunks into a common chunk.
 */

const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.moduleKeyword], color: 'var(--st-kw)' },
  { tag: [t.string, t.special(t.string)], color: 'var(--st-str)' },
  { tag: [t.number, t.bool, t.null], color: 'var(--st-num)' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: 'var(--st-cmt)', fontStyle: 'italic' },
  { tag: [t.typeName, t.className], color: 'var(--st-type)' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: 'var(--st-fn)' },
  { tag: [t.propertyName, t.attributeName], color: 'var(--st-prop)' },
  { tag: [t.tagName, t.angleBracket], color: 'var(--st-tag)' },
  { tag: [t.operator, t.punctuation, t.separator], color: 'var(--st-punc)' },
  { tag: [t.variableName, t.definition(t.variableName)], color: 'var(--st-text)' },
])

function languageFor(kind: FileKind): Extension[] {
  if (kind === 'html') return [htmlLang()]
  if (kind === 'css') return [cssLang()]
  return [javascript()]
}

const theme = EditorView.theme(
  {
    '&': { height: '100%', fontSize: 'var(--st-code-size)', color: 'var(--st-text)' },
    '.cm-scroller': {
      fontFamily: 'var(--st-mono)',
      lineHeight: '1.55',
      paddingBottom: '30vh',
    },
    '.cm-content': { caretColor: 'var(--st-accent)' },
    '.cm-gutters': {
      background: 'var(--st-panel)',
      color: 'var(--st-faint)',
      border: 'none',
      minWidth: '2.2em',
    },
    '.cm-activeLine': { background: 'var(--st-active)' },
    '.cm-activeLineGutter': { background: 'var(--st-active)', color: 'var(--st-dim)' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
      background: 'var(--st-selection)',
    },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--st-accent)', borderLeftWidth: '2px' },
    '.cm-matchingBracket, &.cm-focused .cm-matchingBracket': { background: 'var(--st-match)' },
  },
  { dark: true },
)

interface Props {
  /** Remounts the document when the tab changes. */
  kind: FileKind
  /** Also part of the remount key: switching Site must not carry history over. */
  siteId: string
  initialText: string
  onChange: (text: string) => void
  onReady: (view: EditorView) => void
}

export function Editor({ kind, siteId, initialText, onChange, onReady }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const changeRef = useRef(onChange)
  changeRef.current = onChange
  const readyRef = useRef(onReady)
  readyRef.current = onReady

  useEffect(() => {
    if (!host.current) return
    const view = new EditorView({
      state: EditorState.create({
        doc: initialText,
        extensions: [
          lineNumbers(),
          history(),
          highlightActiveLine(),
          bracketMatching(),
          closeBrackets(),
          indentOnInput(),
          syntaxHighlighting(highlight),
          EditorView.lineWrapping,
          keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
          languageFor(kind),
          theme,
          EditorView.updateListener.of((u) => {
            if (u.docChanged) changeRef.current(u.state.doc.toString())
          }),
        ],
      }),
      parent: host.current,
    })
    readyRef.current(view)
    return () => view.destroy()
    // initialText is intentionally not a dependency: it is the seed for this
    // document, and re-running on every keystroke would destroy the editor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, siteId])

  return <div className="st-editor" ref={host} />
}

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
import { highlightSelectionMatches, search, searchKeymap } from '@codemirror/search'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'
import { tags as t } from '@lezer/highlight'

/*
 * The editing surface.
 *
 * CodeMirror owns its own DOM and state, so this component is a thin imperative
 * shell: mount once per file, tear down on unmount. React never re-renders the
 * editor's contents.
 */

/** Matches the App's palette rather than CodeMirror's defaults. */
const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.moduleKeyword], color: 'var(--ide-kw)' },
  { tag: [t.string, t.special(t.string)], color: 'var(--ide-str)' },
  { tag: [t.number, t.bool, t.null], color: 'var(--ide-num)' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: 'var(--ide-cmt)', fontStyle: 'italic' },
  { tag: [t.typeName, t.className, t.namespace], color: 'var(--ide-type)' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: 'var(--ide-fn)' },
  { tag: [t.propertyName, t.attributeName], color: 'var(--ide-prop)' },
  { tag: [t.tagName, t.angleBracket], color: 'var(--ide-tag)' },
  { tag: [t.operator, t.punctuation, t.separator], color: 'var(--ide-punc)' },
  { tag: [t.definition(t.variableName), t.variableName], color: 'var(--ide-text)' },
])

/** Language support chosen by extension. Everything else is plain text. */
function languageFor(path: string): Extension[] {
  if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(path)) {
    return [javascript({ typescript: /\.tsx?$/.test(path), jsx: /x$/.test(path) })]
  }
  if (path.endsWith('.css')) return [css()]
  if (path.endsWith('.html')) return [html()]
  if (path.endsWith('.json')) return [json()]
  return []
}

const theme = EditorView.theme(
  {
    '&': { height: '100%', fontSize: 'var(--ide-code-size)', color: 'var(--ide-text)' },
    '.cm-scroller': {
      fontFamily: 'var(--ide-mono)',
      lineHeight: '1.55',
      // Momentum scrolling, and room to scroll the last line clear of the bar.
      paddingBottom: '40vh',
    },
    '.cm-content': { caretColor: 'var(--ide-accent)' },
    '.cm-gutters': {
      background: 'var(--ide-panel)',
      color: 'var(--ide-faint)',
      border: 'none',
      // Narrow gutter: horizontal space is the scarcest resource on a phone.
      minWidth: '2.2em',
    },
    '.cm-activeLine': { background: 'var(--ide-active)' },
    '.cm-activeLineGutter': { background: 'var(--ide-active)', color: 'var(--ide-dim)' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
      background: 'var(--ide-selection)',
    },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--ide-accent)', borderLeftWidth: '2px' },
    '.cm-selectionMatch': { background: 'var(--ide-match)' },
    '.cm-matchingBracket, &.cm-focused .cm-matchingBracket': {
      background: 'var(--ide-match)',
      outline: '1px solid var(--ide-hairline)',
    },
    '.cm-panels': { background: 'var(--ide-panel)', color: 'var(--ide-text)' },
    '.cm-panels input, .cm-panels button': {
      background: 'var(--ide-bg)',
      color: 'var(--ide-text)',
      border: '1px solid var(--ide-hairline)',
      borderRadius: '6px',
      padding: '4px 7px',
    },
    '.cm-searchMatch': { background: 'var(--ide-match)' },
    '.cm-searchMatch-selected': { background: 'var(--ide-accent)', color: '#06121b' },
  },
  { dark: true },
)

interface Props {
  path: string
  initialText: string
  onChange: (text: string) => void
  /** Set once on mount so the parent can drive the key bar. */
  onReady: (view: EditorView) => void
}

export function Editor({ path, initialText, onChange, onReady }: Props) {
  const host = useRef<HTMLDivElement>(null)
  // Kept in a ref so changing the handler never forces the editor to remount
  // and lose cursor position or undo history.
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
          highlightSelectionMatches(),
          bracketMatching(),
          closeBrackets(),
          indentOnInput(),
          search({ top: true }),
          syntaxHighlighting(highlight),
          EditorView.lineWrapping,
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...searchKeymap,
            indentWithTab,
          ]),
          languageFor(path),
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
    // Remount only when the file changes: a new file is a new document, new
    // language and a fresh undo history.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  return <div className="ide-editor" ref={host} />
}

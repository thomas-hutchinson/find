import { useMemo, useRef } from 'react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const gutterRef = useRef<HTMLPreElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const lineNumbers = useMemo(() => {
    const count = value.split('\n').length
    return Array.from({ length: count }, (_, i) => i + 1).join('\n')
  }, [value])

  const syncScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  return (
    <div className="lc-editor">
      <pre className="lc-editor-gutter" ref={gutterRef}>
        {lineNumbers}
      </pre>
      <textarea
        ref={textareaRef}
        className="lc-editor-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
        wrap="off"
        aria-label="JavaScript source"
      />
    </div>
  )
}

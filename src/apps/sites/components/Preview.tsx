/*
 * The Preview frame.
 *
 * `sandbox` without `allow-same-origin` is the load-bearing part: the frame
 * gets an opaque origin, so a Site's script cannot reach Find's localStorage or
 * IndexedDB. Find is a public site whose origin holds the Devices location
 * history and the IDE's edits — pasting someone else's HTML to "see what it
 * does" must not hand it any of that.
 *
 * The other flags are enabled because without them an ordinary page looks
 * broken for reasons the user cannot see: forms do nothing, target="_blank"
 * links are dead, alert() silently no-ops. None of them re-grants storage.
 * `allow-top-navigation` stays off — that is the flag that would let a Site
 * hijack the whole tab.
 */
const SANDBOX = 'allow-scripts allow-forms allow-popups allow-modals'

interface Props {
  /** Composed document, or null before the first Run. */
  doc: string | null
  /** Changes on every Run so the frame remounts and scripts re-execute. */
  runKey: number
}

export function Preview({ doc, runKey }: Props) {
  if (doc === null) {
    return (
      <div className="st-preview st-preview--empty">
        <p>Press Run to see this site.</p>
      </div>
    )
  }
  return (
    <iframe
      key={runKey}
      className="st-preview"
      title="Site preview"
      sandbox={SANDBOX}
      srcDoc={doc}
    />
  )
}

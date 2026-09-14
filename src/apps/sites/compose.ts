import type { Site } from './store'

/*
 * Turning three files into one document.
 *
 * The hard case is that people paste. Someone drops a complete page —
 * `<!doctype html><html>…</html>` — into the markup field; someone else types
 * a bare `<h1>Hello</h1>`. Both have to work, and both need the stylesheet and
 * the script injected.
 *
 * DOMParser handles both without a special case: given a fragment it
 * constructs the missing html/head/body, and given a full document it keeps the
 * one that is there. String-splicing around `</head>` looks simpler right up
 * until someone omits the tag, at which point it silently does the wrong thing.
 *
 * Parsing here is safe: `DOMParser` with `text/html` neither executes scripts
 * nor fetches resources.
 */

export function compose(site: Pick<Site, 'html' | 'css' | 'js'>): string {
  const doc = new DOMParser().parseFromString(site.html || '', 'text/html')

  if (site.css.trim()) {
    const style = doc.createElement('style')
    style.textContent = site.css
    doc.head.appendChild(style)
  }

  if (site.js.trim()) {
    const script = doc.createElement('script')
    // textContent, never innerHTML: the script is data here, not markup to
    // re-parse, and `</script>` inside a string must not terminate the element.
    script.textContent = site.js
    doc.body.appendChild(script)
  }

  // A pasted fragment has no charset or viewport; without them the preview
  // renders desktop-width on a phone and mangles non-ASCII text.
  if (!doc.querySelector('meta[charset]')) {
    const meta = doc.createElement('meta')
    meta.setAttribute('charset', 'utf-8')
    doc.head.prepend(meta)
  }
  if (!doc.querySelector('meta[name="viewport"]')) {
    const meta = doc.createElement('meta')
    meta.setAttribute('name', 'viewport')
    meta.setAttribute('content', 'width=device-width, initial-scale=1')
    doc.head.prepend(meta)
  }

  return '<!doctype html>\n' + doc.documentElement.outerHTML
}

/** A filename-safe stem from a Site name, never empty. */
export function slug(name: string): string {
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return s || 'site'
}

/**
 * Hand the composed document to the user as one self-contained file.
 *
 * There is no backend, so this is the only way a Site leaves the device.
 */
export function download(site: Site): void {
  const url = URL.createObjectURL(new Blob([compose(site)], { type: 'text/html' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${slug(site.name)}.html`
  a.click()
  URL.revokeObjectURL(url)
}

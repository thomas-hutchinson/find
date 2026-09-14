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

/**
 * Forwards the Site's console output and uncaught errors to the parent.
 *
 * Without this a broken script fails silently: the error lands in the browser's
 * devtools console, which someone on a phone will never open, and pressing Run
 * appears to do nothing at all.
 *
 * Injected only for the Preview — `download()` composes without it, so the file
 * a user takes away is their own code and nothing else.
 *
 * No line numbers: the Site's script is an inline `<script>` in the composed
 * document, so the browser reports positions relative to that document rather
 * than to script.js. A wrong line number is worse than none.
 */
const CONSOLE_SHIM = `(function () {
  var send = function (level, text) {
    try { parent.postMessage({ __findConsole: true, level: level, text: text }, '*') } catch (e) {}
  };
  var fmt = function (args) {
    return Array.prototype.map.call(args, function (a) {
      if (typeof a === 'string') return a;
      try { return JSON.stringify(a); } catch (e) { return String(a); }
    }).join(' ');
  };
  ['log', 'info', 'warn', 'error'].forEach(function (level) {
    var original = console[level];
    console[level] = function () {
      send(level, fmt(arguments));
      if (original) original.apply(console, arguments);
    };
  });
  window.addEventListener('error', function (e) { send('error', e.message); });
  window.addEventListener('unhandledrejection', function (e) {
    var r = e.reason;
    send('error', 'Unhandled promise rejection: ' + ((r && r.message) || String(r)));
  });
})();`

export function compose(
  site: Pick<Site, 'html' | 'css' | 'js'>,
  { instrument = false }: { instrument?: boolean } = {},
): string {
  const doc = new DOMParser().parseFromString(site.html || '', 'text/html')

  if (instrument) {
    // First child of head, so it is installed before anything the Site does.
    const shim = doc.createElement('script')
    shim.textContent = CONSOLE_SHIM
    doc.head.prepend(shim)
  }

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

/** One console line forwarded from a running Preview. */
export interface LogEntry {
  id: number
  level: 'log' | 'info' | 'warn' | 'error'
  text: string
}

/**
 * True only for messages from a Preview frame we own.
 *
 * The frame has an opaque origin, so `event.origin` is the string "null" and is
 * worthless for authentication. Identity has to come from the source window.
 */
export function isPreviewMessage(
  event: MessageEvent,
  frame: HTMLIFrameElement | null,
): event is MessageEvent<{ __findConsole: true; level: LogEntry['level']; text: string }> {
  if (!frame || event.source !== frame.contentWindow) return false
  const data = event.data as { __findConsole?: unknown } | null
  return Boolean(data && typeof data === 'object' && data.__findConsole === true)
}

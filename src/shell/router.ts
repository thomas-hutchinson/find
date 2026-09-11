import { useSyncExternalStore } from 'react'

/*
 * Hash routing, hand-rolled.
 *
 * Hash rather than the History API because Find is served from GitHub Pages,
 * which has no rewrite rules: `/find/lifecycle` would 404 on refresh and on PWA
 * cold-start. Routes are flat — the Shell owns `#/<appId>` and an App owns
 * nothing below it.
 */

/** The App id in the URL, or '' for Home. */
function read(): string {
  const raw = window.location.hash.replace(/^#\/?/, '')
  return raw.split(/[/?]/)[0] ?? ''
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function useRoute(): string {
  return useSyncExternalStore(subscribe, read, () => '')
}

export function navigate(id: string): void {
  window.location.hash = id ? `/${id}` : '/'
}

export function goHome(): void {
  navigate('')
}

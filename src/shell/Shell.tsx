import { Suspense, lazy, useMemo } from 'react'
import Home from './Home'
import { findApp } from './registry'
import { goHome, useRoute } from './router'
import type { LoadedApp } from './types'

/*
 * The Shell — owns the window, the route, and the bar. It renders exactly one
 * App at a time and unmounts it on leave, so an App can never keep a sensor or
 * a timer running behind another App's UI.
 */

/** React.lazy wrappers, created once per App id and reused across renders. */
const lazyCache = new Map<string, LoadedApp>()

function resolve(id: string): LoadedApp | undefined {
  const cached = lazyCache.get(id)
  if (cached) return cached
  const entry = findApp(id)
  if (!entry) return undefined
  const loaded: LoadedApp = { ...entry, Component: lazy(entry.load) }
  lazyCache.set(id, loaded)
  return loaded
}

export default function Shell() {
  const route = useRoute()
  const app = useMemo(() => (route ? resolve(route) : undefined), [route])

  // Unknown id falls back to Home rather than a dead end.
  if (!app) return <Home />

  return (
    <>
      <div className="shell-bar">
        <button
          type="button"
          className="shell-bar__back"
          onClick={goHome}
          aria-label="Back to Find"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Find</span>
        </button>
        <span className="shell-bar__title">{app.name}</span>
      </div>

      {/* isolation: isolate confines the App's z-indexes to this container, so
          no App can paint over the Shell bar however high it stacks. */}
      <main className="shell-host" key={app.id}>
        <Suspense fallback={<div className="shell-loading">Loading…</div>}>
          <app.Component />
        </Suspense>
      </main>
    </>
  )
}

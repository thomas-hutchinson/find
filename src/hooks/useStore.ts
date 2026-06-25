import { useEffect, useState, useSyncExternalStore } from 'react'
import { getSnapshot, subscribe } from '../store/devices'

/** Subscribe to the persisted device store. */
export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot)
}

/**
 * A coarse clock that re-renders on an interval so relative times
 * ("2m ago") and freshness colours stay current without per-component timers.
 */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

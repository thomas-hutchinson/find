import { SCAFFOLD } from './scaffold'

/*
 * Sites are user-authored content with no backup and no undo, so they live in
 * IndexedDB rather than localStorage. Two reasons: localStorage's ~5MB is shared
 * with every other App on this origin — a large Site could break Devices — and
 * IndexedDB is the right store for documents someone would be upset to lose.
 *
 * When IndexedDB is unavailable (Safari private browsing, locked-down
 * profiles), the store runs in memory and reports `storage: 'memory'` so the UI
 * can warn *before* the user has typed 500 lines. It deliberately does not fall
 * back to localStorage: that would undo the isolation above.
 */

export interface Site {
  id: string
  name: string
  html: string
  css: string
  js: string
  createdAt: number
  updatedAt: number
}

export type StorageMode = 'loading' | 'indexeddb' | 'memory'

export interface State {
  sites: Site[]
  storage: StorageMode
}

const DB_NAME = 'find.sites'
const DB_VERSION = 1
const STORE = 'sites'
/** Long enough to batch a burst of typing, short enough to survive a fast exit. */
const SAVE_DEBOUNCE_MS = 400

type Listener = () => void

let state: State = { sites: [], storage: 'loading' }
const listeners = new Set<Listener>()
let db: IDBDatabase | null = null
const pending = new Map<string, ReturnType<typeof setTimeout>>()

function emit(): void {
  state = { ...state }
  for (const l of listeners) l()
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): State {
  return state
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    let settled = false
    const done = (value: IDBDatabase | null) => {
      if (settled) return
      settled = true
      resolve(value)
    }
    try {
      if (typeof indexedDB === 'undefined') return done(null)
      const req = indexedDB.open(DB_NAME, DB_VERSION)
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) {
          req.result.createObjectStore(STORE, { keyPath: 'id' })
        }
      }
      req.onsuccess = () => done(req.result)
      req.onerror = () => done(null)
      req.onblocked = () => done(null)
      // Safari private browsing can leave the request hanging rather than
      // erroring; don't let the app sit on a spinner forever.
      setTimeout(() => done(null), 3000)
    } catch {
      done(null)
    }
  })
}

/** Hydrate from IndexedDB. Safe to call more than once; only the first runs. */
let started = false
export async function start(): Promise<void> {
  if (started) return
  started = true
  db = await openDb()
  if (!db) {
    state = { sites: state.sites, storage: 'memory' }
    emit()
    return
  }
  const sites = await new Promise<Site[]>((resolve) => {
    try {
      const req = db!.transaction(STORE, 'readonly').objectStore(STORE).getAll()
      req.onsuccess = () => resolve((req.result as Site[]) ?? [])
      req.onerror = () => resolve([])
    } catch {
      resolve([])
    }
  })
  sites.sort((a, b) => b.updatedAt - a.updatedAt)
  state = { sites, storage: 'indexeddb' }
  emit()
}

function put(site: Site): void {
  if (!db) return
  try {
    db.transaction(STORE, 'readwrite').objectStore(STORE).put(site)
  } catch {
    // A failed write must not lose what is already in memory; the user keeps
    // working and the warning banner already explains storage is unreliable.
  }
}

function queueSave(site: Site): void {
  const existing = pending.get(site.id)
  if (existing) clearTimeout(existing)
  pending.set(
    site.id,
    setTimeout(() => {
      pending.delete(site.id)
      const current = state.sites.find((s) => s.id === site.id)
      if (current) put(current)
    }, SAVE_DEBOUNCE_MS),
  )
}

/** Write any queued saves immediately — the Shell unmounts Apps on leave. */
export function flush(): void {
  for (const [id, timer] of pending) {
    clearTimeout(timer)
    const current = state.sites.find((s) => s.id === id)
    if (current) put(current)
  }
  pending.clear()
}

export function create(): Site {
  const now = Date.now()
  const site: Site = {
    id: newId(),
    name: 'Untitled site',
    ...SCAFFOLD,
    createdAt: now,
    updatedAt: now,
  }
  state = { ...state, sites: [site, ...state.sites] }
  put(site)
  emit()
  return site
}

export function get(id: string): Site | undefined {
  return state.sites.find((s) => s.id === id)
}

type Editable = Pick<Site, 'name' | 'html' | 'css' | 'js'>

export function update(id: string, patch: Partial<Editable>): void {
  const site = state.sites.find((s) => s.id === id)
  if (!site) return
  const next: Site = { ...site, ...patch, updatedAt: Date.now() }
  state = { ...state, sites: state.sites.map((s) => (s.id === id ? next : s)) }
  queueSave(next)
  emit()
}

export function remove(id: string): void {
  const timer = pending.get(id)
  if (timer) {
    clearTimeout(timer)
    pending.delete(id)
  }
  state = { ...state, sites: state.sites.filter((s) => s.id !== id) }
  if (db) {
    try {
      db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id)
    } catch {
      // Removed from view regardless; a stale row would be filtered on reload.
    }
  }
  emit()
}

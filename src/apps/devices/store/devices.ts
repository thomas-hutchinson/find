import type { Device, DeviceType, GeoFix, PersistedState } from '../types'
import { offsetFix } from '../lib/geo'

const KEY = 'find.v1'
const MAP_KEY = 'find.map.v1'

type Listener = () => void

const EMPTY: PersistedState = {
  version: 1,
  devices: [],
  selfId: null,
  seeded: false,
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function load(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    if (parsed.version !== 1 || !Array.isArray(parsed.devices)) return EMPTY
    return {
      version: 1,
      devices: parsed.devices as Device[],
      selfId: parsed.selfId ?? null,
      seeded: Boolean(parsed.seeded),
    }
  } catch {
    return EMPTY
  }
}

let state: PersistedState = load()
const listeners = new Set<Listener>()

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage may be full or unavailable; keep running in-memory */
  }
}

function commit(next: PersistedState) {
  state = next
  persist()
  listeners.forEach((l) => l())
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): PersistedState {
  return state
}

// ---- Actions -------------------------------------------------------------

const now = () => Date.now()

/** Ensure a self device exists, creating one on first launch. Returns its id. */
export function ensureSelfDevice(name: string, type: DeviceType): string {
  if (state.selfId && state.devices.some((d) => d.id === state.selfId)) {
    return state.selfId
  }
  const id = uid()
  const t = now()
  const self: Device = {
    id,
    name,
    type,
    isSelf: true,
    lastFix: null,
    battery: null,
    status: 'online',
    createdAt: t,
    updatedAt: t,
  }
  commit({ ...state, devices: [self, ...state.devices], selfId: id })
  return id
}

export function addDevice(input: {
  name: string
  type: DeviceType
  fix: GeoFix | null
  battery?: number | null
}): string {
  const id = uid()
  const t = now()
  const device: Device = {
    id,
    name: input.name.trim() || 'New device',
    type: input.type,
    isSelf: false,
    lastFix: input.fix,
    battery: input.battery ?? null,
    status: 'online',
    createdAt: t,
    updatedAt: t,
  }
  commit({ ...state, devices: [...state.devices, device] })
  return id
}

function patch(id: string, patcher: (d: Device) => Device) {
  let changed = false
  const devices = state.devices.map((d) => {
    if (d.id !== id) return d
    changed = true
    return { ...patcher(d), updatedAt: now() }
  })
  if (changed) commit({ ...state, devices })
}

export function updateFix(id: string, fix: GeoFix) {
  patch(id, (d) => ({ ...d, lastFix: fix }))
}

export function updateSelfBattery(battery: number | null) {
  if (!state.selfId) return
  patch(state.selfId, (d) => ({ ...d, battery }))
}

export function renameDevice(id: string, name: string) {
  patch(id, (d) => ({ ...d, name: name.trim() || d.name }))
}

export function setType(id: string, type: DeviceType) {
  patch(id, (d) => ({ ...d, type }))
}

export function setLost(id: string, lost: boolean) {
  patch(id, (d) => ({ ...d, status: lost ? 'lost' : 'online' }))
}

export function removeDevice(id: string) {
  if (id === state.selfId) return // never forget the device you're on
  commit({ ...state, devices: state.devices.filter((d) => d.id !== id) })
}

/**
 * Seed a few realistic example devices around the given base fix, once.
 * They are obviously editable/forgettable so the user can replace them.
 */
export function seedExamples(base: GeoFix) {
  if (state.seeded) return
  const t = now()
  const minutes = (m: number) => t - m * 60_000
  const examples: Array<{
    name: string
    type: DeviceType
    dx: number
    dy: number
    ts: number
    battery: number
    place: string
    status: Device['status']
  }> = [
    { name: 'AirPods Pro', type: 'headphones', dx: 18, dy: -12, ts: minutes(3), battery: 64, place: 'Here', status: 'online' },
    { name: 'iPad', type: 'tablet', dx: -260, dy: 140, ts: minutes(95), battery: 38, place: 'Home', status: 'idle' },
    { name: 'Work Laptop', type: 'laptop', dx: 2400, dy: -1800, ts: minutes(60 * 26), battery: 12, place: 'Office', status: 'online' },
  ]
  const seeded: Device[] = examples.map((e) => {
    const fix = offsetFix(base, e.dx, e.dy)
    return {
      id: uid(),
      name: e.name,
      type: e.type,
      isSelf: false,
      lastFix: { ...fix, ts: e.ts, place: e.place, accuracy: 25 },
      battery: e.battery,
      status: e.status,
      createdAt: t,
      updatedAt: e.ts,
    }
  })
  commit({ ...state, devices: [...state.devices, ...seeded], seeded: true })
}

// ---- Map view (persisted separately to avoid re-render churn) -------------

export interface MapView {
  center: [number, number]
  zoom: number
}

export function loadMapView(): MapView | null {
  try {
    const raw = localStorage.getItem(MAP_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as MapView
    if (
      Array.isArray(v.center) &&
      v.center.length === 2 &&
      typeof v.zoom === 'number'
    ) {
      return v
    }
    return null
  } catch {
    return null
  }
}

export function saveMapView(view: MapView) {
  try {
    localStorage.setItem(MAP_KEY, JSON.stringify(view))
  } catch {
    /* ignore */
  }
}

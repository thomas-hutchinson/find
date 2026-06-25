export type DeviceType =
  | 'phone'
  | 'tablet'
  | 'laptop'
  | 'headphones'
  | 'watch'
  | 'tracker'
  | 'other'

export type DeviceStatus = 'online' | 'idle' | 'lost'

/** A single positional reading for a device. */
export interface GeoFix {
  lat: number
  lng: number
  /** Reported accuracy radius in metres, if known. */
  accuracy?: number
  /** Epoch milliseconds at which the fix was taken. */
  ts: number
  /** Optional friendly place label (e.g. "Home"). */
  place?: string
}

export interface Device {
  id: string
  name: string
  type: DeviceType
  /** True for the single device the app is running on. */
  isSelf: boolean
  /** Last known position, or null if we have never had a fix. */
  lastFix: GeoFix | null
  /** Battery percentage 0–100, or null if unknown. */
  battery: number | null
  status: DeviceStatus
  createdAt: number
  updatedAt: number
}

/** The shape persisted to localStorage. */
export interface PersistedState {
  version: 1
  devices: Device[]
  /** Id of the self device, if one has been created. */
  selfId: string | null
  /** Whether the one-time example devices have been seeded. */
  seeded: boolean
}

/** Freshness buckets derived from how old a device's last fix is. */
export type Freshness = 'live' | 'stale' | 'cold' | 'unknown'

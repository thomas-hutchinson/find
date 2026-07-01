import type { DeviceType, Freshness, GeoFix } from '../types'

const EARTH_RADIUS_M = 6_371_000
const TEN_MIN = 10 * 60 * 1000
const ONE_DAY = 24 * 60 * 60 * 1000

const toRad = (deg: number) => (deg * Math.PI) / 180

/** Great-circle distance between two fixes, in metres. */
export function haversineMetres(a: GeoFix, b: GeoFix): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Human distance label with stable, tabular-friendly precision. */
export function formatDistance(metres: number): string {
  if (metres < 10) return 'here'
  if (metres < 1000) return `${Math.round(metres)} m`
  if (metres < 10_000) return `${(metres / 1000).toFixed(1)} km`
  return `${Math.round(metres / 1000)} km`
}

/** Relative "last seen" label. */
export function formatAge(ts: number, now: number): string {
  const ms = Math.max(0, now - ts)
  if (ms < 45 * 1000) return 'just now'
  const mins = Math.round(ms / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  const weeks = Math.round(days / 7)
  return `${weeks}w ago`
}

/** Bucket a fix's age into a freshness band that drives colour. */
export function freshnessOf(fix: GeoFix | null, now: number): Freshness {
  if (!fix) return 'unknown'
  const age = now - fix.ts
  if (age < TEN_MIN) return 'live'
  if (age < ONE_DAY) return 'stale'
  return 'cold'
}

export function freshnessColorVar(f: Freshness): string {
  switch (f) {
    case 'live':
      return 'var(--mint)'
    case 'stale':
      return 'var(--stale)'
    case 'cold':
      return 'var(--cold)'
    default:
      return 'var(--text-faint)'
  }
}

/** Guess a device type from a free-text name so registration needs no picker. */
export function guessType(name: string): DeviceType {
  const n = name.toLowerCase()
  const has = (...words: string[]) => words.some((w) => n.includes(w))
  if (has('pod', 'bud', 'headphone', 'earphone', 'beats', 'sony wh', 'speaker'))
    return 'headphones'
  if (has('watch', 'band')) return 'watch'
  if (has('ipad', 'tab', 'tablet', 'kindle', 'slate')) return 'tablet'
  if (has('mac', 'book', 'laptop', 'pc', 'desktop', 'thinkpad', 'surface', 'xps'))
    return 'laptop'
  if (has('tag', 'tile', 'tracker', 'key', 'wallet', 'finder', 'chip'))
    return 'tracker'
  if (has('phone', 'iphone', 'pixel', 'galaxy', 'oneplus', 'android', 'mobile'))
    return 'phone'
  return 'other'
}

/** A small deterministic offset (metres → degrees) for de-overlapping pins. */
export function offsetFix(base: GeoFix, dxMetres: number, dyMetres: number): GeoFix {
  const dLat = (dyMetres / EARTH_RADIUS_M) * (180 / Math.PI)
  const dLng =
    (dxMetres / (EARTH_RADIUS_M * Math.cos(toRad(base.lat)))) * (180 / Math.PI)
  return { ...base, lat: base.lat + dLat, lng: base.lng + dLng }
}

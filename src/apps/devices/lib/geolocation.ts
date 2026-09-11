import type { GeoFix } from '../types'

export type PermissionState = 'unknown' | 'prompt' | 'granted' | 'denied'

const HIGH_ACCURACY: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 15_000,
  timeout: 15_000,
}

function fixFromPosition(pos: GeolocationPosition): GeoFix {
  return {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    accuracy: pos.coords.accuracy ?? undefined,
    ts: pos.timestamp,
  }
}

export function geolocationSupported(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator
}

/** One-shot position read, used when registering a new device. */
export function getCurrentFix(): Promise<GeoFix> {
  return new Promise((resolve, reject) => {
    if (!geolocationSupported()) {
      reject(new Error('Geolocation unavailable'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(fixFromPosition(pos)),
      (err) => reject(err),
      HIGH_ACCURACY,
    )
  })
}

/** Continuous position watch for the self device. Returns an unsubscribe fn. */
export function watchFix(
  onFix: (fix: GeoFix) => void,
  onError?: (err: GeolocationPositionError) => void,
): () => void {
  if (!geolocationSupported()) {
    onError?.({
      code: 2,
      message: 'Geolocation unavailable',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    } as GeolocationPositionError)
    return () => {}
  }
  const id = navigator.geolocation.watchPosition(
    (pos) => onFix(fixFromPosition(pos)),
    (err) => onError?.(err),
    HIGH_ACCURACY,
  )
  return () => navigator.geolocation.clearWatch(id)
}

/** Best-effort permission probe (not all browsers expose the Permissions API). */
export async function queryPermission(): Promise<PermissionState> {
  try {
    if (typeof navigator === 'undefined' || !navigator.permissions) return 'unknown'
    const status = await navigator.permissions.query({
      name: 'geolocation' as PermissionName,
    })
    return status.state as PermissionState
  } catch {
    return 'unknown'
  }
}

/** Best-effort battery read for the self device (Chromium-only API). */
export async function readBattery(): Promise<number | null> {
  try {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{ level: number }>
    }
    if (!nav.getBattery) return null
    const b = await nav.getBattery()
    return Math.round(b.level * 100)
  } catch {
    return null
  }
}

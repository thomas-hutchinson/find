import { useEffect, useState } from 'react'
import type { DeviceType } from '../types'
import {
  getCurrentFix,
  queryPermission,
  readBattery,
  watchFix,
  type PermissionState,
} from '../lib/geolocation'
import {
  ensureSelfDevice,
  seedExamples,
  updateFix,
  updateSelfBattery,
} from '../store/devices'

/** Best-effort friendly name + type for the device the app runs on. */
function describeThisDevice(): { name: string; type: DeviceType } {
  const ua = navigator.userAgent || ''
  if (/iPhone/i.test(ua)) return { name: 'This iPhone', type: 'phone' }
  if (/iPad/i.test(ua)) return { name: 'This iPad', type: 'tablet' }
  if (/Android/i.test(ua)) {
    return /Mobile/i.test(ua)
      ? { name: 'This phone', type: 'phone' }
      : { name: 'This tablet', type: 'tablet' }
  }
  if (/Macintosh/i.test(ua)) return { name: 'This Mac', type: 'laptop' }
  if (/Windows/i.test(ua)) return { name: 'This PC', type: 'laptop' }
  return { name: 'This device', type: 'laptop' }
}

export interface SelfTracking {
  permission: PermissionState
  hasFix: boolean
}

/**
 * Creates the self device on first launch, watches its live position,
 * seeds example devices once a base location is known, and tracks battery.
 */
export function useSelfTracking(): SelfTracking {
  const [permission, setPermission] = useState<PermissionState>('unknown')
  const [hasFix, setHasFix] = useState(false)

  useEffect(() => {
    const desc = describeThisDevice()
    const selfId = ensureSelfDevice(desc.name, desc.type)
    let cancelled = false

    void queryPermission().then((p) => !cancelled && setPermission(p))
    void readBattery().then((b) => !cancelled && b != null && updateSelfBattery(b))

    const onFix = (fix: Parameters<typeof updateFix>[1]) => {
      if (cancelled) return
      updateFix(selfId, fix)
      seedExamples(fix)
      setHasFix(true)
      setPermission('granted')
    }

    // One-shot read so we centre/seed quickly, plus a live watch.
    void getCurrentFix()
      .then(onFix)
      .catch(() => {
        /* the watch below surfaces permission errors */
      })

    const stop = watchFix(onFix, (err) => {
      if (cancelled) return
      if (err.code === err.PERMISSION_DENIED) setPermission('denied')
    })

    return () => {
      cancelled = true
      stop()
    }
  }, [])

  return { permission, hasFix }
}

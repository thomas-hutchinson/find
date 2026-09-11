import type { Device, Freshness, PersistedState } from '../types'
import { freshnessOf, haversineMetres } from './geo'

export interface DeviceVM {
  device: Device
  freshness: Freshness
  /** Distance from the self device in metres, or null if not computable. */
  distanceM: number | null
}

/**
 * Decorate every device with its freshness and distance-from-self, then sort:
 * self first, then nearest-first, with fix-less devices last.
 */
export function decorate(
  state: PersistedState,
  now: number,
  query = '',
): DeviceVM[] {
  const self = state.devices.find((d) => d.id === state.selfId) ?? null
  const selfFix = self?.lastFix ?? null
  const q = query.trim().toLowerCase()

  const vms = state.devices
    .filter((d) => (q ? d.name.toLowerCase().includes(q) : true))
    .map<DeviceVM>((device) => ({
      device,
      freshness: freshnessOf(device.lastFix, now),
      distanceM:
        selfFix && device.lastFix && !device.isSelf
          ? haversineMetres(selfFix, device.lastFix)
          : device.isSelf
            ? 0
            : null,
    }))

  return vms.sort((a, b) => {
    if (a.device.isSelf) return -1
    if (b.device.isSelf) return 1
    const ax = a.distanceM ?? Number.POSITIVE_INFINITY
    const bx = b.distanceM ?? Number.POSITIVE_INFINITY
    if (ax !== bx) return ax - bx
    return a.device.name.localeCompare(b.device.name)
  })
}

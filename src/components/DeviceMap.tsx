import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { DeviceType, Freshness, GeoFix } from '../types'
import type { DeviceVM } from '../lib/select'
import { loadMapView, saveMapView } from '../store/devices'

export interface MapHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void
  flyToSelf: () => void
}

interface DeviceMapProps {
  devices: DeviceVM[]
  selfFix: GeoFix | null
  selectedId: string | null
  onSelect: (id: string) => void
  /** Bottom padding (px) so pins clear the bottom sheet when flying to them. */
  bottomInset: number
}

const DEFAULT_VIEW: { center: [number, number]; zoom: number } = {
  center: [37.7749, -122.4194],
  zoom: 13,
}

/** Minimal filled glyphs for map pins (kept compact for small markers). */
function glyphPath(type: DeviceType): string {
  switch (type) {
    case 'phone':
      return '<rect x="7" y="3" width="10" height="18" rx="2.4"/>'
    case 'tablet':
      return '<rect x="5" y="4" width="14" height="16" rx="2.2"/>'
    case 'laptop':
      return '<rect x="5" y="6" width="14" height="8" rx="1.3"/><path d="M3 16h18l1.3 2.4a.6.6 0 0 1-.5.9H2.2a.6.6 0 0 1-.5-.9Z"/>'
    case 'headphones':
      return '<path d="M5 13a7 7 0 0 1 14 0" fill="none" stroke="currentColor" stroke-width="1.9"/><rect x="3.5" y="12.5" width="3.6" height="6.5" rx="1.8"/><rect x="16.9" y="12.5" width="3.6" height="6.5" rx="1.8"/>'
    case 'watch':
      return '<rect x="7.5" y="7.5" width="9" height="9" rx="2.4"/><rect x="9.5" y="3" width="5" height="4" rx="1"/><rect x="9.5" y="17" width="5" height="4" rx="1"/>'
    case 'tracker':
      return '<circle cx="12" cy="12" r="8"/>'
    default:
      return '<circle cx="12" cy="12" r="6.5"/>'
  }
}

function freshClass(f: Freshness): string {
  return `pin--${f}`
}

function pinIcon(vm: DeviceVM, selected: boolean): L.DivIcon {
  const cls = ['pin', freshClass(vm.freshness)]
  if (selected) cls.push('pin--selected')
  if (vm.device.status === 'lost') cls.push('pin--lost')
  const html = `
    <div class="pin__disc">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">${glyphPath(
        vm.device.type,
      )}</svg>
    </div>
    <div class="pin__tail"></div>`
  return L.divIcon({
    className: cls.join(' '),
    html,
    iconSize: [40, 48],
    iconAnchor: [20, 46],
  })
}

function selfIcon(): L.DivIcon {
  return L.divIcon({
    className: 'self-pin',
    html: '<div class="self-pin__ring"></div><div class="self-pin__dot"></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

export const DeviceMap = forwardRef<MapHandle, DeviceMapProps>(function DeviceMap(
  { devices, selfFix, selectedId, onSelect, bottomInset },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const selfMarkerRef = useRef<L.Marker | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const insetRef = useRef(bottomInset)
  insetRef.current = bottomInset

  // Init the map exactly once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const saved = loadMapView() ?? DEFAULT_VIEW
    const map = L.map(containerRef.current, {
      center: saved.center,
      zoom: saved.zoom,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: false,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map)

    map.on('moveend', () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const c = map.getCenter()
        saveMapView({ center: [c.lat, c.lng], zoom: map.getZoom() })
      }, 400)
    })

    mapRef.current = map
    const markers = markersRef.current

    // Keep the map sized correctly as the rail/sheet posture changes.
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(containerRef.current)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      ro.disconnect()
      map.remove()
      mapRef.current = null
      markers.clear()
      selfMarkerRef.current = null
    }
  }, [])

  // Reconcile device markers whenever the decorated list or selection changes.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const live = markersRef.current
    const seen = new Set<string>()

    for (const vm of devices) {
      if (vm.device.isSelf || !vm.device.lastFix) continue
      seen.add(vm.device.id)
      const { lat, lng } = vm.device.lastFix
      const selected = vm.device.id === selectedId
      const existing = live.get(vm.device.id)
      if (existing) {
        existing.setLatLng([lat, lng])
        existing.setIcon(pinIcon(vm, selected))
      } else {
        const m = L.marker([lat, lng], {
          icon: pinIcon(vm, selected),
          keyboard: true,
          title: vm.device.name,
        })
        m.on('click', () => onSelectRef.current(vm.device.id))
        m.addTo(map)
        live.set(vm.device.id, m)
      }
    }

    // Drop markers for devices that disappeared.
    for (const [id, marker] of live) {
      if (!seen.has(id)) {
        marker.remove()
        live.delete(id)
      }
    }
  }, [devices, selectedId])

  // Self pin tracks live position.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!selfFix) {
      selfMarkerRef.current?.remove()
      selfMarkerRef.current = null
      return
    }
    if (!selfMarkerRef.current) {
      selfMarkerRef.current = L.marker([selfFix.lat, selfFix.lng], {
        icon: selfIcon(),
        interactive: false,
        zIndexOffset: -1000,
      }).addTo(map)
    } else {
      selfMarkerRef.current.setLatLng([selfFix.lat, selfFix.lng])
    }
  }, [selfFix])

  useImperativeHandle(ref, () => ({
    flyTo(lat, lng, zoom) {
      const map = mapRef.current
      if (!map) return
      const targetZoom = zoom ?? Math.max(map.getZoom(), 16)
      // Shift the centre down so the pin clears the bottom sheet and sits in
      // the middle of the *visible* area above it.
      const center = map.unproject(
        map.project([lat, lng], targetZoom).add(L.point(0, insetRef.current / 2)),
        targetZoom,
      )
      map.flyTo(center, targetZoom, { duration: 0.45 })
    },
    flyToSelf() {
      const map = mapRef.current
      if (!map || !selfFix) return
      const targetZoom = Math.max(map.getZoom(), 15)
      const center = map.unproject(
        map
          .project([selfFix.lat, selfFix.lng], targetZoom)
          .add(L.point(0, insetRef.current / 2)),
        targetZoom,
      )
      map.flyTo(center, targetZoom, { duration: 0.45 })
    },
  }))

  return <div ref={containerRef} className="map" role="application" aria-label="Map of your devices" />
})

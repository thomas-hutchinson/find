import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DeviceType, GeoFix } from './types'
import { decorate } from './lib/select'
import { getCurrentFix } from './lib/geolocation'
import { buzz, playFindChime } from './lib/sound'
import { addDevice, loadMapView, removeDevice, setLost } from './store/devices'
import { useIsTablet } from './hooks/useMediaQuery'
import { useNow, useStore } from './hooks/useStore'
import { useSelfTracking } from './hooks/useSelfTracking'
import { DeviceMap, type MapHandle } from './components/DeviceMap'
import { DeviceList } from './components/DeviceList'
import { BottomSheet, PEEK_FRACTION } from './components/BottomSheet'
import { SideRail } from './components/SideRail'
import { Modal } from './components/Modal'
import { ActionSheet } from './components/ActionSheet'
import { AddSheet } from './components/AddSheet'
import { SearchPill } from './components/SearchPill'
import { LocateFab } from './components/LocateFab'
import { Toast } from './components/Toast'
import { PlusIcon } from './components/Icons'

function fallbackFix(selfFix: GeoFix | null): GeoFix {
  if (selfFix) return { ...selfFix, ts: Date.now() }
  const view = loadMapView()
  const [lat, lng] = view?.center ?? [37.7749, -122.4194]
  return { lat, lng, ts: Date.now() }
}

function openDirections(fix: GeoFix) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${fix.lat},${fix.lng}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export default function App() {
  const { permission, hasFix } = useSelfTracking()
  const state = useStore()
  const now = useNow()
  const isTablet = useIsTablet()

  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [vh, setVh] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800,
  )

  const mapRef = useRef<MapHandle>(null)

  // Keep viewport-derived layout values fresh across rotation / resize.
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const vms = useMemo(() => decorate(state, now, query), [state, now, query])
  const selfFix = useMemo(
    () => state.devices.find((d) => d.id === state.selfId)?.lastFix ?? null,
    [state],
  )
  const selectedVm = useMemo(
    () => vms.find((v) => v.device.id === selectedId) ?? null,
    [vms, selectedId],
  )

  const bottomInset = isTablet ? 0 : Math.round(PEEK_FRACTION * vh)

  const flash = useCallback((msg: string) => setToast(msg), [])
  const closeSelected = useCallback(() => setSelectedId(null), [])
  const closeAdd = useCallback(() => setAddOpen(false), [])
  const clearToast = useCallback(() => setToast(null), [])

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id)
      const dev = state.devices.find((d) => d.id === id)
      if (dev?.lastFix) mapRef.current?.flyTo(dev.lastFix.lat, dev.lastFix.lng)
    },
    [state],
  )

  const handleRing = useCallback(
    (id: string) => {
      const dev = state.devices.find((d) => d.id === id)
      if (!dev) return
      if (dev.isSelf) {
        playFindChime()
        buzz()
        flash('Playing sound on this device')
      } else {
        flash(`“${dev.name}” can only be rung from the device itself`)
      }
    },
    [state, flash],
  )

  const handleDirections = useCallback(
    (id: string) => {
      const dev = state.devices.find((d) => d.id === id)
      if (dev?.lastFix) openDirections(dev.lastFix)
    },
    [state],
  )

  const handleToggleLost = useCallback(
    (id: string) => {
      const dev = state.devices.find((d) => d.id === id)
      if (!dev) return
      const nextLost = dev.status !== 'lost'
      setLost(id, nextLost)
      flash(nextLost ? `Marked “${dev.name}” as lost` : `“${dev.name}” found`)
    },
    [state, flash],
  )

  const handleForget = useCallback(
    (id: string) => {
      const dev = state.devices.find((d) => d.id === id)
      removeDevice(id)
      setSelectedId(null)
      if (dev) flash(`Forgot “${dev.name}”`)
    },
    [state, flash],
  )

  const handleLocateMe = useCallback(() => {
    if (!selfFix) {
      flash('Location is off — enable it to see yourself')
      return
    }
    mapRef.current?.flyToSelf()
  }, [selfFix, flash])

  const handleAdd = useCallback(
    async (name: string, type: DeviceType) => {
      setAddOpen(false)
      let fix: GeoFix
      try {
        fix = await getCurrentFix()
      } catch {
        fix = fallbackFix(selfFix)
      }
      addDevice({ name, type, fix })
      mapRef.current?.flyTo(fix.lat, fix.lng)
      flash(`Added “${name}”`)
    },
    [selfFix, flash],
  )

  const total = state.devices.length
  const countLabel = (
    <div className="header__label">
      My devices<span className="header__count"> · {total}</span>
    </div>
  )

  const addButton = (
    <button
      className="addbtn"
      aria-label="Add a device"
      onClick={() => setAddOpen(true)}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <PlusIcon size={24} />
    </button>
  )

  const list = (
    <DeviceList
      vms={vms}
      now={now}
      selectedId={selectedId}
      onSelect={handleSelect}
      onRing={handleRing}
      emptyHint={query ? 'No devices match.' : 'No devices yet.'}
    />
  )

  const addLabel =
    permission === 'denied'
      ? 'Location off — drops at the map centre'
      : 'Using your current location'

  // The phone action sheet and (either layout's) add sheet are true overlays;
  // the tablet device detail is inline, so it does not make the base inert.
  const actionModalOpen = !isTablet && !!selectedVm && !addOpen
  const baseInert = addOpen || actionModalOpen

  return (
    <div className={`app${isTablet ? ' app--tablet' : ''}`}>
      <div className="base" inert={baseInert || undefined}>
        <DeviceMap
          ref={mapRef}
          devices={vms}
          selfFix={selfFix}
          selectedId={selectedId}
          onSelect={handleSelect}
          bottomInset={bottomInset}
        />

        {isTablet ? (
          <SideRail>
            <div className="rail__head">
              <div className="brand">
                <span className="brand__dot" />
                Find
              </div>
              <div className="rail__controls">
                <SearchPill value={query} onChange={setQuery} block />
                {addButton}
              </div>
              {countLabel}
            </div>
            <div className="rail__scroll">{list}</div>
            {selectedVm && (
              <div className="rail__detail">
                <button
                  className="rail__close"
                  aria-label="Close details"
                  onClick={closeSelected}
                >
                  Done
                </button>
                <ActionSheet
                  vm={selectedVm}
                  now={now}
                  onRing={handleRing}
                  onDirections={handleDirections}
                  onToggleLost={handleToggleLost}
                  onForget={handleForget}
                />
              </div>
            )}
          </SideRail>
        ) : (
          <>
            <div className="float-top">
              <SearchPill value={query} onChange={setQuery} />
            </div>
            <BottomSheet
              header={
                <div className="header">
                  {addButton}
                  {countLabel}
                </div>
              }
            >
              {list}
            </BottomSheet>
          </>
        )}

        <LocateFab
          onClick={handleLocateMe}
          disabled={!selfFix}
          bottomOffset={bottomInset + 16}
        />
      </div>

      {!isTablet && (
        <Modal
          open={!!selectedVm && !addOpen}
          onClose={closeSelected}
          variant="sheet"
          labelledBy="action-title"
        >
          {selectedVm && (
            <ActionSheet
              vm={selectedVm}
              now={now}
              onRing={handleRing}
              onDirections={handleDirections}
              onToggleLost={handleToggleLost}
              onForget={handleForget}
            />
          )}
        </Modal>
      )}

      <Modal
        open={addOpen}
        onClose={closeAdd}
        variant={isTablet ? 'card' : 'sheet'}
        labelledBy="add-title"
      >
        <AddSheet
          defaultName="New device"
          locationLabel={addLabel}
          locating={!hasFix && permission !== 'denied'}
          onAdd={handleAdd}
        />
      </Modal>

      <Toast message={toast} onDone={clearToast} />

      <div className="sr-only" role="status" aria-live="polite">
        {query
          ? `${vms.length} device${vms.length === 1 ? '' : 's'} matching ${query}`
          : ''}
      </div>
    </div>
  )
}

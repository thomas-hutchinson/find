import type { DeviceVM } from '../lib/select'
import { formatAge, formatDistance, freshnessColorVar } from '../lib/geo'
import { DeviceGlyph, DirectionsIcon, ForgetIcon, LostIcon, SoundIcon } from './Icons'

interface ActionSheetProps {
  vm: DeviceVM
  now: number
  onRing: (id: string) => void
  onDirections: (id: string) => void
  onToggleLost: (id: string) => void
  onForget: (id: string) => void
}

export function ActionSheet({
  vm,
  now,
  onRing,
  onDirections,
  onToggleLost,
  onForget,
}: ActionSheetProps) {
  const { device, freshness, distanceM } = vm
  const fix = device.lastFix
  const isLost = device.status === 'lost'

  const meta: string[] = []
  if (device.isSelf) meta.push('This device')
  else if (distanceM != null) meta.push(formatDistance(distanceM))
  if (fix?.place) meta.push(fix.place)
  if (fix) meta.push(formatAge(fix.ts, now))
  if (device.battery != null) meta.push(`${device.battery}%`)

  const canRoute = !!fix

  return (
    <div className="action">
      <div className="action__head">
        <div
          className="action__tile"
          style={{ color: freshnessColorVar(freshness) }}
        >
          <DeviceGlyph type={device.type} size={28} />
        </div>
        <div className="action__title">
          <div className="action__name" id="action-title">
            {device.name}
            {isLost && <span className="pill pill--lost">Lost</span>}
          </div>
          <div className="action__meta tnum">
            {meta.length ? meta.join(' · ') : 'No location yet'}
          </div>
        </div>
      </div>

      <div className="action__row">
        <button
          className="act"
          disabled={!canRoute}
          onClick={() => onDirections(device.id)}
        >
          <DirectionsIcon size={22} />
          <span>Directions</span>
        </button>
        <button className="act" onClick={() => onRing(device.id)}>
          <SoundIcon size={22} />
          <span>Play sound</span>
        </button>
        {!device.isSelf && (
          <button
            className={`act${isLost ? ' act--active' : ''}`}
            onClick={() => onToggleLost(device.id)}
          >
            <LostIcon size={22} />
            <span>{isLost ? 'Found' : 'Mark lost'}</span>
          </button>
        )}
      </div>

      {!device.isSelf && (
        <button className="action__forget" onClick={() => onForget(device.id)}>
          <ForgetIcon size={17} />
          Forget this device
        </button>
      )}
      {!device.isSelf && !canRoute && (
        <p className="action__note">
          This device has no location yet — it’ll appear on the map once it
          reports in.
        </p>
      )}
    </div>
  )
}

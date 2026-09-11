import { memo } from 'react'
import type { DeviceVM } from '../lib/select'
import { formatAge, formatDistance, freshnessColorVar } from '../lib/geo'
import { ChevronIcon, DeviceGlyph, SoundIcon } from './Icons'

interface DeviceRowProps {
  vm: DeviceVM
  now: number
  selected: boolean
  onSelect: (id: string) => void
  onRing: (id: string) => void
}

function batteryClass(b: number): string {
  if (b <= 20) return 'battery battery--low'
  return 'battery'
}

export const DeviceRow = memo(function DeviceRow({
  vm,
  now,
  selected,
  onSelect,
  onRing,
}: DeviceRowProps) {
  const { device, freshness, distanceM } = vm
  const fix = device.lastFix

  const distance = device.isSelf
    ? 'This device'
    : distanceM != null
      ? formatDistance(distanceM)
      : 'No location yet'

  const metaParts: string[] = []
  if (fix?.place) metaParts.push(fix.place)
  if (fix) metaParts.push(formatAge(fix.ts, now))

  return (
    <div
      className={`row${selected ? ' row--selected' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${device.name}, ${distance}`}
      onClick={() => onSelect(device.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(device.id)
        }
      }}
    >
      <div className="row__tile" style={{ color: freshnessColorVar(freshness) }}>
        <DeviceGlyph type={device.type} size={26} />
        {device.battery != null && (
          <span className={batteryClass(device.battery)}>{device.battery}</span>
        )}
      </div>

      <div className="row__body">
        <div className="row__line1">
          <span className="row__name">{device.name}</span>
          {device.status === 'lost' && <span className="pill pill--lost">Lost</span>}
        </div>
        <div className="row__line2">
          <span
            className="dot"
            style={{ background: freshnessColorVar(freshness) }}
            aria-hidden="true"
          />
          <span className="row__distance tnum">{distance}</span>
          {metaParts.length > 0 && (
            <span className="row__meta tnum"> · {metaParts.join(' · ')}</span>
          )}
        </div>
      </div>

      <button
        className="row__ring"
        aria-label={`Play sound on ${device.name}`}
        onClick={(e) => {
          e.stopPropagation()
          onRing(device.id)
        }}
      >
        <SoundIcon size={20} />
      </button>
      <ChevronIcon size={20} className="row__chevron" />
    </div>
  )
})

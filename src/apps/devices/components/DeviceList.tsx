import type { DeviceVM } from '../lib/select'
import { DeviceRow } from './DeviceRow'

interface DeviceListProps {
  vms: DeviceVM[]
  now: number
  selectedId: string | null
  onSelect: (id: string) => void
  onRing: (id: string) => void
  emptyHint: string
}

export function DeviceList({
  vms,
  now,
  selectedId,
  onSelect,
  onRing,
  emptyHint,
}: DeviceListProps) {
  if (vms.length === 0) {
    return <div className="list__empty">{emptyHint}</div>
  }
  return (
    <div className="list">
      {vms.map((vm) => (
        <DeviceRow
          key={vm.device.id}
          vm={vm}
          now={now}
          selected={vm.device.id === selectedId}
          onSelect={onSelect}
          onRing={onRing}
        />
      ))}
    </div>
  )
}

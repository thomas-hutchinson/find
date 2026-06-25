import { useEffect, useRef, useState } from 'react'
import type { DeviceType } from '../types'
import { guessType } from '../lib/geo'
import { DeviceGlyph } from './Icons'

interface AddSheetProps {
  defaultName: string
  locationLabel: string
  locating: boolean
  onAdd: (name: string, type: DeviceType) => void
}

const TYPES: { type: DeviceType; label: string }[] = [
  { type: 'phone', label: 'Phone' },
  { type: 'tablet', label: 'Tablet' },
  { type: 'laptop', label: 'Laptop' },
  { type: 'headphones', label: 'Buds' },
  { type: 'watch', label: 'Watch' },
  { type: 'tracker', label: 'Tag' },
  { type: 'other', label: 'Other' },
]

export function AddSheet({ defaultName, locationLabel, locating, onAdd }: AddSheetProps) {
  const [name, setName] = useState('')
  const [manualType, setManualType] = useState<DeviceType | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Open with the keyboard already up — no field tap needed.
    const id = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(id)
  }, [])

  const effectiveType = manualType ?? guessType(name || defaultName)
  const finalName = name.trim() || defaultName

  const submit = () => onAdd(finalName, effectiveType)

  return (
    <div className="add">
      <h2 className="add__title" id="add-title">
        Add a device
      </h2>

      <div className="add__field">
        <div className="add__glyph" style={{ color: 'var(--beacon)' }}>
          <DeviceGlyph type={effectiveType} size={26} />
        </div>
        <input
          ref={inputRef}
          className="add__input"
          value={name}
          placeholder={defaultName}
          enterKeyHint="done"
          autoComplete="off"
          aria-label="Device name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
      </div>

      <div className="add__types" role="group" aria-label="Device type">
        {TYPES.map((t) => (
          <button
            key={t.type}
            className={`typechip${effectiveType === t.type ? ' typechip--on' : ''}`}
            aria-pressed={effectiveType === t.type}
            onClick={() => setManualType(t.type)}
          >
            <DeviceGlyph type={t.type} size={18} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="add__loc">
        <span className="dot" style={{ background: 'var(--mint)' }} aria-hidden="true" />
        {locating ? 'Finding your location…' : locationLabel}
      </div>

      <button className="add__cta" onClick={submit}>
        Add here
      </button>
    </div>
  )
}

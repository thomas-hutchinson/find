import { useEffect, useRef, useState, type ReactNode } from 'react'

export const PEEK_FRACTION = 0.42
export const EXPANDED_FRACTION = 0.88

interface BottomSheetProps {
  /** Header content (e.g. label + add button); also a drag affordance. */
  header: ReactNode
  children: ReactNode
}

/**
 * Phone-only draggable sheet with two snap points (peek / expanded).
 * Tapping the handle toggles; dragging it snaps to the nearest point.
 */
export function BottomSheet({ header, children }: BottomSheetProps) {
  const [vh, setVh] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800,
  )
  const [expanded, setExpanded] = useState(false)
  const [drag, setDrag] = useState<number | null>(null)
  const startY = useRef(0)
  const startTranslate = useRef(0)
  const moved = useRef(false)

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const collapsed = (EXPANDED_FRACTION - PEEK_FRACTION) * vh
  const snapTranslate = expanded ? 0 : collapsed
  const translate = drag ?? snapTranslate

  const onPointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY
    startTranslate.current = snapTranslate
    moved.current = false
    setDrag(snapTranslate)
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (drag == null) return
    const next = startTranslate.current + (e.clientY - startY.current)
    if (Math.abs(e.clientY - startY.current) > 4) moved.current = true
    setDrag(Math.min(collapsed, Math.max(0, next)))
  }
  const onPointerUp = () => {
    if (drag == null) return
    if (!moved.current) {
      // A tap toggles between peek and expanded.
      setExpanded((v) => !v)
    } else {
      setExpanded(drag < collapsed / 2)
    }
    setDrag(null)
  }

  return (
    <section
      className="sheet"
      style={{
        height: `${EXPANDED_FRACTION * 100}vh`,
        transform: `translateY(${translate}px)`,
        transition: drag == null ? undefined : 'none',
      }}
      aria-label="Your devices"
    >
      <div
        className="sheet__handle"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="button"
        tabIndex={0}
        aria-label={expanded ? 'Collapse list' : 'Expand list'}
        aria-expanded={expanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setExpanded((v) => !v)
          }
        }}
      >
        <span className="grabber" />
        {header}
      </div>
      <div className="sheet__scroll">{children}</div>
    </section>
  )
}

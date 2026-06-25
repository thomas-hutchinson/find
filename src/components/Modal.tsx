import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** 'sheet' rises from the bottom (phone); 'card' centres (tablet). */
  variant: 'sheet' | 'card'
  labelledBy?: string
  children: ReactNode
}

/**
 * A lightweight modal layer used for the per-device action sheet and the
 * add-device flow. On phones it is a bottom sheet with drag-down-to-dismiss;
 * on tablets it is a centred card.
 */
export function Modal({ open, onClose, variant, labelledBy, children }: ModalProps) {
  const [dragY, setDragY] = useState(0)
  const startY = useRef<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Focus management: move focus into the dialog on open, restore it on close.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    const first = panel?.querySelector<HTMLElement>(
      'input, button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    )
    ;(first ?? panel)?.focus()
    return () => previouslyFocused?.focus?.()
  }, [open])

  // Reset any residual drag offset whenever we open.
  useEffect(() => {
    if (open) setDragY(0)
  }, [open])

  if (!open) return null

  const isSheet = variant === 'sheet'

  // Keep Tab focus cycling within the dialog.
  const onTrapKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const panel = panelRef.current
    if (!panel) return
    const focusable = panel.querySelectorAll<HTMLElement>(
      'input, button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement
    if (e.shiftKey && active === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isSheet) return
    startY.current = e.clientY
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (startY.current == null) return
    setDragY(Math.max(0, e.clientY - startY.current))
  }
  const onPointerUp = () => {
    if (startY.current == null) return
    if (dragY > 110) onClose()
    else setDragY(0)
    startY.current = null
  }

  return (
    <div
      className={`modal modal--${variant}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className={`modal__panel modal__panel--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        style={isSheet ? { transform: `translateY(${dragY}px)` } : undefined}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onTrapKeyDown}
      >
        {isSheet && (
          <div
            className="modal__grab"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="grabber" />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

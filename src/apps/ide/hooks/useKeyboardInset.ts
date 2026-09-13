import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Keeps `--ide-kb` on the given element equal to the height the on-screen
 * keyboard is covering.
 *
 * This is the difference between a usable phone editor and a useless one. The
 * Shell hosts every App in a `position: fixed` container, and on iOS the layout
 * viewport does not shrink when the keyboard opens — `window.innerHeight` stays
 * the same — so a fixed-position editor keeps its full height and the bottom
 * third of it, including the caret, sits behind the keyboard. Only
 * `visualViewport` reports what is actually visible.
 *
 * Falls back to doing nothing where `visualViewport` is unavailable; the editor
 * then behaves as it would on a desktop, which is correct there anyway.
 */
export function useKeyboardInset(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const vv = window.visualViewport
    const el = ref.current
    if (!vv || !el) return

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        // What the layout thinks exists, minus what is actually visible.
        const hidden = window.innerHeight - vv.height - vv.offsetTop
        // Ignore sub-pixel noise and the small deltas from URL-bar collapse.
        el.style.setProperty('--ide-kb', hidden > 60 ? `${Math.round(hidden)}px` : '0px')
      })
    }

    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      cancelAnimationFrame(frame)
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
      el.style.removeProperty('--ide-kb')
    }
  }, [ref])
}

import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Keeps `--st-kb` equal to the height the on-screen keyboard is covering.
 *
 * The Shell hosts every App in a `position: fixed` container, and iOS does not
 * shrink the layout viewport when the keyboard opens — only `visualViewport`
 * reports what is actually visible. Without this the caret sits behind the
 * keyboard. (The IDE carries its own copy: Apps share no code by design.)
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
        const hidden = window.innerHeight - vv.height - vv.offsetTop
        el.style.setProperty('--st-kb', hidden > 60 ? `${Math.round(hidden)}px` : '0px')
      })
    }
    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      cancelAnimationFrame(frame)
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
      el.style.removeProperty('--st-kb')
    }
  }, [ref])
}

import type { ReactNode } from 'react'

/** Tablet master pane: a fixed-width rail beside the persistent map. */
export function SideRail({ children }: { children: ReactNode }) {
  return (
    <aside className="rail" aria-label="Your devices">
      {children}
    </aside>
  )
}

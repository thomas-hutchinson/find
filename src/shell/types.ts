import type { ComponentType, LazyExoticComponent } from 'react'

/**
 * Everything the Shell knows about an App.
 *
 * Deliberately minimal: the Shell gives an App a container and nothing else —
 * no storage, no toast, no navigation handle. Add a field here only once a real
 * App cannot work without it. See AGENTS.md.
 */
export interface AppEntry {
  /** URL segment and React key. Lowercase, no spaces: `#/devices`. */
  id: string
  /** Shown on the Home tile and in the Shell bar. */
  name: string
  /** One line, shown under the name on the Home tile. */
  description: string
  /** Inline SVG component. Defined in the Registry so it stays out of the
   *  App's lazily-loaded chunk. */
  icon: ComponentType
  /** Any CSS colour. Tints this App's Home tile so Home previews its identity. */
  accent: string
  /** Dynamic import of the App's entry module, whose default export is the
   *  App's root component. Lazy so one App's dependencies never load for
   *  another. */
  load: () => Promise<{ default: ComponentType }>
}

/** Internal: an AppEntry with its memoised React.lazy wrapper. */
export type LoadedApp = AppEntry & {
  Component: LazyExoticComponent<ComponentType>
}

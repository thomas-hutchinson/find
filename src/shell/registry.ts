import { createElement as h } from 'react'
import type { AppEntry } from './types'

/*
 * The Registry — the single list of Apps.
 *
 * Adding an App means adding one entry here and creating its folder under
 * src/apps/<id>/. Nothing else in the Shell changes. See AGENTS.md.
 *
 * Icons are declared here rather than imported from the App so that adding an
 * App to Home never pulls that App's code into the initial bundle.
 */

const svg = (...children: string[]) =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.75,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': true,
    },
    children.map((d, i) => h('path', { key: i, d })),
  )

const DevicesIcon = () =>
  svg(
    'M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z',
    'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  )

const LifecycleIcon = () =>
  svg(
    'M4 6h6M4 12h3M4 18h8',
    'M15 4v6M15 4l-2.5 2.5M15 4l2.5 2.5',
    'M19 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  )

export const registry: AppEntry[] = [
  {
    id: 'devices',
    name: 'Devices',
    description: 'Locate your things on a live map',
    icon: DevicesIcon,
    accent: '#ffb02e',
    load: () => import('../apps/devices'),
  },
  {
    id: 'lifecycle',
    name: 'Lifecycle',
    description: 'Trace every read and write on an object',
    icon: LifecycleIcon,
    accent: '#7dd3fc',
    load: () => import('../apps/lifecycle'),
  },
]

export const findApp = (id: string): AppEntry | undefined =>
  registry.find((a) => a.id === id)

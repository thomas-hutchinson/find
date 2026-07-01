import type { DeviceType } from '../types'

interface IconProps {
  size?: number
  className?: string
}

/* ---- Chrome: stroke icons (1.75px, rounded caps) ---- */

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function Svg({
  size = 24,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" {...strokeProps} />
    <line x1="20" y1="20" x2="16" y2="16" {...strokeProps} />
  </Svg>
)

export const LocateIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" {...strokeProps} />
    <line x1="12" y1="2" x2="12" y2="5" {...strokeProps} />
    <line x1="12" y1="19" x2="12" y2="22" {...strokeProps} />
    <line x1="2" y1="12" x2="5" y2="12" {...strokeProps} />
    <line x1="19" y1="12" x2="22" y2="12" {...strokeProps} />
  </Svg>
)

export const DirectionsIcon = (p: IconProps) => (
  <Svg {...p}>
    <polygon points="3,11 21,3 13,21 11,13" {...strokeProps} />
  </Svg>
)

export const SoundIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9.5 L8 9.5 L13 5 L13 19 L8 14.5 L4 14.5 Z" {...strokeProps} />
    <path d="M16.5 8.5 a4 4 0 0 1 0 7" {...strokeProps} />
    <path d="M19 6 a7 7 0 0 1 0 12" {...strokeProps} />
  </Svg>
)

export const ChevronIcon = (p: IconProps) => (
  <Svg {...p}>
    <polyline points="9,6 15,12 9,18" {...strokeProps} />
  </Svg>
)

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <line x1="12" y1="5" x2="12" y2="19" {...strokeProps} />
    <line x1="5" y1="12" x2="19" y2="12" {...strokeProps} />
  </Svg>
)

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <line x1="6" y1="6" x2="18" y2="18" {...strokeProps} />
    <line x1="18" y1="6" x2="6" y2="18" {...strokeProps} />
  </Svg>
)

export const ForgetIcon = (p: IconProps) => (
  <Svg {...p}>
    <polyline points="4,7 20,7" {...strokeProps} />
    <path d="M9 7 V5 a1 1 0 0 1 1-1 h4 a1 1 0 0 1 1 1 V7" {...strokeProps} />
    <path d="M6 7 l1 12 a1 1 0 0 0 1 1 h8 a1 1 0 0 0 1-1 l1-12" {...strokeProps} />
  </Svg>
)

export const LostIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 L21 19 H3 Z" {...strokeProps} />
    <line x1="12" y1="10" x2="12" y2="14" {...strokeProps} />
    <circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
)

/* ---- Device glyphs: filled monochrome ---- */

function GlyphSvg({
  size = 24,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

const PhoneGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <rect x="9.5" y="18.4" width="5" height="1.4" rx="0.7" fill="var(--surface)" />
  </GlyphSvg>
)

const TabletGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2.4" />
    <circle cx="12" cy="18.3" r="0.9" fill="var(--surface)" />
  </GlyphSvg>
)

const LaptopGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <rect x="5" y="5" width="14" height="9" rx="1.4" />
    <path d="M3 16 h18 l1.5 2.6 a0.7 0.7 0 0 1-0.6 1 H2.1 a0.7 0.7 0 0 1-0.6-1 Z" />
  </GlyphSvg>
)

const HeadphonesGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <path d="M4 13 a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="1.9" />
    <rect x="3" y="12.5" width="4" height="7" rx="2" />
    <rect x="17" y="12.5" width="4" height="7" rx="2" />
  </GlyphSvg>
)

const WatchGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <rect x="7" y="7" width="10" height="10" rx="2.6" />
    <rect x="9" y="2.5" width="6" height="4" rx="1.2" />
    <rect x="9" y="17.5" width="6" height="4" rx="1.2" />
  </GlyphSvg>
)

const TrackerGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3" fill="var(--surface)" />
  </GlyphSvg>
)

const OtherGlyph = (p: IconProps) => (
  <GlyphSvg {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.7" />
  </GlyphSvg>
)

const GLYPHS: Record<DeviceType, (p: IconProps) => React.ReactElement> = {
  phone: PhoneGlyph,
  tablet: TabletGlyph,
  laptop: LaptopGlyph,
  headphones: HeadphonesGlyph,
  watch: WatchGlyph,
  tracker: TrackerGlyph,
  other: OtherGlyph,
}

export function DeviceGlyph({
  type,
  size,
  className,
}: { type: DeviceType } & IconProps) {
  const G = GLYPHS[type] ?? OtherGlyph
  return <G size={size} className={className} />
}

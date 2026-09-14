import type { Site } from './store'

/**
 * A Site is exactly three files. Fixed, not arbitrary: a mini filesystem would
 * mean solving relative-path resolution inside a sandboxed preview, and a
 * single HTML file stops being enough the moment you want the CSS out of the
 * way.
 */
export type FileKind = 'html' | 'css' | 'js'

export const FILES: { kind: FileKind; label: string; filename: string }[] = [
  { kind: 'html', label: 'HTML', filename: 'index.html' },
  { kind: 'css', label: 'CSS', filename: 'style.css' },
  { kind: 'js', label: 'JS', filename: 'script.js' },
]

export const read = (site: Site, kind: FileKind): string => site[kind]

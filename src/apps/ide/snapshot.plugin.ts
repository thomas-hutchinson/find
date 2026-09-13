import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import type { Plugin } from 'vite'

/*
 * Build-time snapshot of this repository's own source, exposed to the IDE app
 * as the virtual module `virtual:project-snapshot`.
 *
 * This is build-time config, so it cannot live purely inside the App at
 * runtime — it is wired up by one import in vite.config.ts. That is the
 * documented exception described in AGENTS.md. Keeping the plugin in the App's
 * folder means the exception costs one line elsewhere rather than a block of
 * app-specific logic in the shared config.
 */

const VIRTUAL_ID = 'virtual:project-snapshot'
const RESOLVED_ID = '\0' + VIRTUAL_ID

/** Directories never worth showing in a phone IDE. */
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.github', 'docs', 'public'])

/** Only text we can meaningfully syntax-highlight and edit. */
const KEEP_EXT = /\.(ts|tsx|js|jsx|css|html|json|md|yml|yaml)$/

/** Skip anything generated or too large to be useful on a phone. */
const SKIP_FILES = new Set(['package-lock.json'])
const MAX_BYTES = 200_000

function walk(dir: string, root: string, out: Record<string, string>): void {
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith('.') && name !== '.oxlintrc.json') continue
    const full = join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      if (SKIP_DIRS.has(name)) continue
      walk(full, root, out)
    } else {
      if (SKIP_FILES.has(name) || !KEEP_EXT.test(name) || stat.size > MAX_BYTES) continue
      out[relative(root, full).split(sep).join('/')] = readFileSync(full, 'utf8')
    }
  }
}

export function projectSnapshot(root = process.cwd()): Plugin {
  return {
    name: 'project-snapshot',
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : null),
    load(id) {
      if (id !== RESOLVED_ID) return null
      const files: Record<string, string> = {}
      walk(root, root, files)
      // Re-read on every dev-server request for this module, so editing a file
      // on disk shows up in the IDE without restarting Vite.
      return `export const files = ${JSON.stringify(files)}
export const capturedAt = ${JSON.stringify(new Date().toISOString())}`
    },
  }
}

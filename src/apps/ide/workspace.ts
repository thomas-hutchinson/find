import { capturedAt, files as snapshot } from 'virtual:project-snapshot'

/*
 * The workspace: a read-only build-time snapshot of the repository, with a
 * layer of local edits on top.
 *
 * Edits live in localStorage and never leave the device. The Shell unmounts an
 * App when you leave it, so every change is persisted immediately rather than
 * on some "save" action — navigating to Home mid-edit must not lose work.
 */

const KEY = 'find.ide.edits.v1'

type Edits = Record<string, string>
type Listener = () => void

function load(): Edits {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    // Drop edits for files that no longer exist in the snapshot, so a rename
    // upstream cannot strand an unreachable buffer forever.
    const out: Edits = {}
    for (const [path, text] of Object.entries(parsed as Edits)) {
      if (typeof text === 'string' && path in snapshot) out[path] = text
    }
    return out
  } catch {
    return {}
  }
}

let edits: Edits = load()
const listeners = new Set<Listener>()

function persist(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(edits))
  } catch {
    // Quota exceeded or storage blocked — keep the in-memory edit rather than
    // throwing away what the user just typed.
  }
}

function emit(): void {
  for (const l of listeners) l()
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): Edits {
  return edits
}

/** Every path in the repository snapshot, sorted. */
export const paths: string[] = Object.keys(snapshot).sort()

/** When the snapshot was taken — shown in the UI so staleness is visible. */
export const snapshotTakenAt = capturedAt

/** Current text for a path: the local edit if there is one, else the original. */
export function read(path: string): string {
  return edits[path] ?? snapshot[path] ?? ''
}

/** The original, unedited text. */
export function original(path: string): string {
  return snapshot[path] ?? ''
}

export function isDirty(path: string): boolean {
  return path in edits
}

export function dirtyPaths(): string[] {
  return Object.keys(edits).sort()
}

export function write(path: string, text: string): void {
  if (!(path in snapshot)) return
  if (text === snapshot[path]) {
    // Edited back to the original: stop tracking it rather than storing a
    // no-op diff.
    if (!(path in edits)) return
    delete edits[path]
  } else {
    if (edits[path] === text) return
    edits[path] = text
  }
  edits = { ...edits }
  persist()
  emit()
}

export function revert(path: string): void {
  if (!(path in edits)) return
  delete edits[path]
  edits = { ...edits }
  persist()
  emit()
}

export function revertAll(): void {
  if (Object.keys(edits).length === 0) return
  edits = {}
  persist()
  emit()
}

/**
 * A unified diff of every edited file, in `git apply` format.
 *
 * Edits are local-only by design — there is no backend and no token — so this
 * is how work leaves the phone: export the patch, apply it on a real machine.
 */
export function exportPatch(): string {
  const out: string[] = []
  for (const path of dirtyPaths()) {
    out.push(diffFile(path, original(path), read(path)))
  }
  return out.join('')
}

/**
 * Minimal unified diff. Emits one hunk covering the whole file rather than
 * computing minimal hunks — patches are applied by `git apply`, which does not
 * care, and a correct whole-file hunk beats a subtly wrong minimal one.
 */
function diffFile(path: string, before: string, after: string): string {
  const a = before.length ? before.split('\n') : []
  const b = after.length ? after.split('\n') : []
  const lines = [
    `diff --git a/${path} b/${path}`,
    `--- a/${path}`,
    `+++ b/${path}`,
    `@@ -1,${a.length} +1,${b.length} @@`,
    ...a.map((l) => `-${l}`),
    ...b.map((l) => `+${l}`),
  ]
  return lines.join('\n') + '\n'
}

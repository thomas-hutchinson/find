/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'virtual:project-snapshot' {
  /** Repository source captured at build time, keyed by repo-relative path. */
  export const files: Record<string, string>
  /** ISO timestamp of when the snapshot was taken. */
  export const capturedAt: string
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
// App-specific build-time plugin, kept in the App's own folder. See AGENTS.md.
import { projectSnapshot } from './src/apps/ide/snapshot.plugin.ts'

// Served from a GitHub Pages project site (https://<user>.github.io/find/),
// so production assets live under /find/. Local dev stays at the root.
// Override with BASE_PATH at build time for a custom domain or user site.
const BASE = process.env.BASE_PATH ?? '/find/'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => {
  // `preview` serves the production build, so it needs the production base too
  // — otherwise the built HTML asks for /find/assets/* and gets 404s.
  const base = command === 'build' || isPreview ? BASE : '/'
  return {
  base,
  plugins: [
    react(),
    projectSnapshot(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Find — Workbench',
        short_name: 'Find',
        description: 'A personal workbench of small, self-contained apps.',
        theme_color: '#0c0e11',
        background_color: '#0c0e11',
        display: 'standalone',
        orientation: 'any',
        start_url: base,
        scope: base,
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // App-specific build-time config. Workbox rules cannot live inside an
        // App's folder, so this is the documented exception to the
        // one-folder-plus-one-Registry-entry rule. See AGENTS.md.
        // Devices: cache OpenStreetMap tiles so the map works offline.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 1000, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  }
})

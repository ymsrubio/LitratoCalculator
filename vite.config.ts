import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    // Installable, offline-capable app shell (issue #15). Only the shell
    // (JS/CSS/HTML/icons) is precached here — the Ledger and Job saving get
    // their own offline strategy in later tickets, so no runtime API
    // caching is configured yet.
    VitePWA({
      // Ship each new deploy straight to open tabs: the new service worker
      // activates immediately (skipWaiting) and takes control without
      // waiting for a manual reload (clientsClaim), so users don't get
      // stuck on a stale cached build.
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'litrato.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Litrato Profit Calculator',
        short_name: 'Litrato',
        description:
          'Instant profit and pricing calculator for Litrato photography packages.',
        // Colours drawn from design.md: --surface is the page background
        // (used as the splash-screen backdrop), --brand is the logo's
        // decorative accent (used for OS/browser chrome tinting).
        background_color: '#FDF8F0',
        theme_color: '#F36519',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the whole app shell so it opens with no network at all.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        skipWaiting: true,
        clientsClaim: true,
        // index.html pulls Outfit from Google Fonts, which is cross-origin and
        // so cannot be precached by the globs above. Without these two rules
        // the app opens offline but falls back to system-ui, which design.md
        // rules out. Cached on first online visit, served from cache after.
        runtimeCaching: [
          {
            // The stylesheet changes when the family or weights change, so
            // revalidate in the background rather than pinning it forever.
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            // The font files themselves are content-addressed and immutable.
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
})

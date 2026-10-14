import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Fixes chunk failure on navigating to any page during redeployment
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['pwa-icon.svg'],
      manifest: {
        name: 'Application Portal',
        short_name: 'AppPortal',
        id: '/',
        start_url: '/',
        display: 'standalone',
        background_color: '#070a12',
        theme_color: '#1976d2',
        icons: [
          {
            purpose: 'maskable',
            sizes: '512x512',
            src: 'pwa-icon.svg',
            type: 'image/svg+xml'
          },
          {
            purpose: 'any',
            sizes: '512x512',
            src: 'pwa-icon.svg',
            type: 'image/svg+xml'
          }
        ],
        screenshots: [
          {
            src: 'pwa-icon.svg',
            sizes: '1280x720',
            type: 'image/svg+xml',
            form_factor: 'wide'
          }
        ]
      },
      workbox: {
        dontCacheBustURLsMatching: /\.\w{8}\./,
        globPatterns: ['assets/**/*.{js,css,png,svg,ico}', 'index.html', '*.webmanifest'],
        globIgnores: ['**/node_modules/**/*', 'sw.js'],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        inlineWorkboxRuntime: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: '/'
      }
    })
  ]
})

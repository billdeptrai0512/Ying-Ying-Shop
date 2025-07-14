import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ying Ying Shop',
        short_name: 'Ying Shop',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true, // allows PWA to work in dev mode
      }
    })
  ],
  workbox: {
    runtimeCaching: [
      {
        // This matches your backend API URL
        urlPattern: ({ url }) => url.pathname.startsWith('/inventory') || url.href.includes(import.meta.env.VITE_BACKEND_URL),
        handler: 'NetworkOnly',
        options: {
          cacheName: 'api-cache',
        }
      }
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: "./tests/setup.js"
  }
})

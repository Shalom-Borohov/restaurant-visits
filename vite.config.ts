import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'
import packageJson from './package.json' with { type: 'json' }

const APP_NAME = 'מסעדות'

const BACKGROUND_COLOR = '#f7f3ee'

export default defineConfig(({ mode }) => ({
  base: '/restaurant-visits/',
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  resolve: mode === 'test' ? { conditions: ['browser'] } : {},
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: APP_NAME,
        short_name: APP_NAME,
        lang: 'he',
        dir: 'rtl',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        scope: '.',
        theme_color: BACKGROUND_COLOR,
        background_color: BACKGROUND_COLOR,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['test/setup.ts'],
    include: ['test/**/*.test.{ts,tsx}'],
    server: {
      deps: { inline: ['@ionic/react', '@ionic/core', 'ionicons', '@stencil/react-output-target', '@lit/react'] },
    },
  },
}))

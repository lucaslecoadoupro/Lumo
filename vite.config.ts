import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// BASE_PATH = '/lumo/' sur GitHub Pages, '/' ailleurs (Vercel, local)
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      input: {
        landing: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app/index.html')
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Lumo — mon repère au collège',
        short_name: 'Lumo',
        description: 'Un point de repère pour mieux vivre ta journée au collège.',
        lang: 'fr',
        start_url: base + 'app/',
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F7F8FC',
        theme_color: '#6266D9',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}']
      }
    })
  ]
})

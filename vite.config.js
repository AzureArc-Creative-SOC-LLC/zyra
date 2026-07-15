import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split long-lived vendor code into its own cache-stable chunk so app
    // updates don't force users to re-download React/router/animation libs.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
            return 'react-vendor'
          }
          if (id.includes('lenis')) return 'motion'
          if (id.includes('lucide-react')) return 'icons'
          return undefined
        },
      },
    },
    // Warn later — route-split chunks are small; the vendor chunk is expected.
    chunkSizeWarningLimit: 900,
  },
})

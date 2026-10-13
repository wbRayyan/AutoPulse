import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Listen on all network interfaces so the dev server is reachable from outside the container
    host: true,
    port: 5173,
    strictPort: true,
    // File change events from Windows bind mounts do not reach the container, so poll instead
    watch: {
      usePolling: true,
    },
  },
})
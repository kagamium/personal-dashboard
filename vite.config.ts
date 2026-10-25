import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    watch: {
      // File events can be unreliable across macOS-to-container bind mounts.
      usePolling: true,
    },
  },
})

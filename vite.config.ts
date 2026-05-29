import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': { target: 'http://localhost:3000', changeOrigin: true },
      '/user': { target: 'http://localhost:3000', changeOrigin: true },
      '/chat': { target: 'http://localhost:3000', changeOrigin: true },
      '/analytics': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
})

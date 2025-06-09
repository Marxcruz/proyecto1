import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',    // <- Esto permite acceso desde tu red local
    port: 5173,
    strictPort: true,
  },
})

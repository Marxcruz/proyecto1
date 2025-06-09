import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true, // Esto evita que Vite busque otro puerto si el 5174 está ocupado
    proxy: {
      '/api/chat': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, '/api/chat')
      }
    }
  },
})

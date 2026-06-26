import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const proxyTarget = mode === 'development'
    ? 'http://localhost:3000'
    : process.env.VITE_API_URL

  return {
    plugins: [react()],
    server: mode === 'development' ? {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true
        }
      }
    } : undefined,
    preview: mode === 'production' ? {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true
        }
      }
    } : undefined
  }
})
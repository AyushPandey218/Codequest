import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Proxy JDoodle API calls to avoid CORS 
      '/jdoodle': {
        target: 'https://api.jdoodle.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jdoodle/, ''),
      },
      // Proxy Wandbox API calls 
      '/wandbox': {
        target: 'https://online.wandbox.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wandbox/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      },
    },
  },
})



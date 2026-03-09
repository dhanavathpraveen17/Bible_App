import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Required for static hosting like Netlify
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    origin: 'http://localhost:5173',
  },
})

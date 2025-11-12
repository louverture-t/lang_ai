import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Set base path for GitHub Pages deployment
  // If deploying to https://<USERNAME>.github.io/<REPO>/
  // If deploying to custom domain, set to '/'
  base: process.env.GITHUB_PAGES ? '/lang_ai/' : '/',
})

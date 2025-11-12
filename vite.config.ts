import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Path aliases for clean imports (@/ → src/)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // GitHub Pages deployment configuration
  // Update base path when deploying: base: '/your-repo-name/'
  base: '/',

  // Build optimization
  build: {
    // Output directory
    outDir: 'dist',

    // Generate source maps for debugging
    sourcemap: true,

    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          // Note: Add 'langchain-vendor': ['langchain'] after installing LangChain (Task #3)
        },
      },
    },

    // Increase chunk size warning limit (default: 500kb)
    chunkSizeWarningLimit: 1000,
  },

  // Development server configuration
  server: {
    port: 5173,
    open: true,
  },
})

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

  // Explicitly configure CSS processing with PostCSS
  css: {
    postcss: './postcss.config.js',
  },

  // Base path configuration for GitHub Pages deployment
  // GitHub Pages requires the repo name as base path: '/lang_ai/'
  // For local development and other platforms, use '/'
  base: process.env.NODE_ENV === 'production' ? '/lang_ai/' : '/',

  // Build optimization
  build: {
    // Output directory
    outDir: 'dist',

    // Disable source maps in production for smaller bundle size
    sourcemap: false,

    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'langchain': ['@langchain/openai', '@langchain/core', 'langchain'],
          'query': ['@tanstack/react-query'],
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

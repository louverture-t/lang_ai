import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRouter } from './AppRouter'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { initializeLangSmith } from '@/lib/langsmith'
import { queryClient } from '@/lib/queryClient'

// Initialize LangSmith tracing (if configured)
initializeLangSmith()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AppRouter />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)

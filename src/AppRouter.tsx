import { Router, Route, Switch } from 'wouter'
import App from './App'
import { NotFound } from './pages/NotFound'

/**
 * AppRouter - Client-side routing configuration
 *
 * Routes:
 * - / - Main dashboard with AI components
 * - * - 404 Not Found page
 *
 * Base path is configured for GitHub Pages deployment in vite.config.ts
 */
export function AppRouter() {
  // Get base path from Vite config (defaults to '/' in development)
  const base = import.meta.env.BASE_URL

  return (
    <Router base={base}>
      <Switch>
        {/* Main Dashboard */}
        <Route path="/" component={App} />

        {/* 404 Not Found */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

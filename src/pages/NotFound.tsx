import { Link } from 'wouter'
import { Home, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * NotFound - 404 error page
 * Displayed when users navigate to non-existent routes
 */
export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-20 w-20 text-muted-foreground" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">404</h1>

        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
          Page Not Found
        </h2>

        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-8 w-8" />
            <h2 className="text-2xl font-semibold">Something went wrong</h2>
          </div>

          <p className="text-center text-muted-foreground max-w-md">
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>

          <Button
            onClick={this.handleReset}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 w-full max-w-2xl rounded-lg border bg-muted p-4">
              <summary className="cursor-pointer font-mono text-sm font-semibold">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 overflow-auto text-xs text-muted-foreground">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

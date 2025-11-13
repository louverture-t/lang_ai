import { ThemeToggle } from '@/components/ThemeToggle'
import { ApiKeyConfig } from '@/components/ApiKeyConfig'
import { AIChat } from '@/components/AIChat'
import { RecipeGenerator } from '@/components/RecipeGenerator'
import { SimpleAIQuery } from '@/components/SimpleAIQuery'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { useApiKey } from '@/hooks/useApiKey'
import { Key, CheckCircle2, ExternalLink } from 'lucide-react'

function App() {
  const { apiKey, hasApiKey, showModal, setShowModal, saveApiKey } = useApiKey()

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Simplified Header */}
        <header className="mb-6 md:mb-8 border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center">
                LangChain Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* API Key Status Indicator */}
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                {hasApiKey ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-success">API Key Set</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowModal(true)}
                      className="h-6 px-2"
                    >
                      Change
                    </Button>
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 text-warning" />
                    <span className="text-warning">No API Key</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowModal(true)}
                      className="h-6 px-2"
                    >
                      Configure
                    </Button>
                  </>
                )}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* API Key Configuration Modal */}
        <ApiKeyConfig
          open={showModal}
          onOpenChange={setShowModal}
          onSave={saveApiKey}
        />

        {/* AI Components Grid */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6" style={{ gridAutoRows: '1fr' }}>
          {/* AI Chat Component */}
          <ErrorBoundary>
            <div className="h-full flex flex-col">
              <AIChat />
            </div>
          </ErrorBoundary>

          {/* Recipe Generator Component */}
          <ErrorBoundary>
            <div className="h-full flex flex-col">
              <RecipeGenerator />
            </div>
          </ErrorBoundary>

          {/* Simple AI Query Component */}
          <ErrorBoundary>
            <div className="h-full flex flex-col">
              <SimpleAIQuery apiKey={apiKey} />
            </div>
          </ErrorBoundary>
        </div>

        {/* API Key Notice Banner - Below components */}
        {!hasApiKey && (
          <div className="mt-6 rounded-lg border bg-card p-4 text-center">
            <p className="text-sm text-muted-foreground">
              This Demo requires your own OPENAI API Key.{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Get your API key
                <ExternalLink className="h-3 w-3" />
              </a>
              {' '}(New users get $5 free credit)
            </p>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}

export default App

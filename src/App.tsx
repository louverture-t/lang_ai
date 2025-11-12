import { ThemeToggle } from '@/components/ThemeToggle'
import { ApiKeyConfig } from '@/components/ApiKeyConfig'
import { AIChat } from '@/components/AIChat'
import { RecipeGenerator } from '@/components/RecipeGenerator'
import { SimpleAIQuery } from '@/components/SimpleAIQuery'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { useApiKey } from '@/hooks/useApiKey'
import { Key, CheckCircle2 } from 'lucide-react'

function App() {
  const { apiKey, hasApiKey, showModal, setShowModal, saveApiKey } = useApiKey()

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header with theme toggle and API key status */}
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">LangChain Dashboard</h1>
              <p className="text-muted-foreground mt-2 text-sm md:text-base">AI Integration Showcase with LangChain.js</p>
            </div>
            <div className="flex items-center gap-3">
              {/* API Key Status Indicator */}
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                {hasApiKey ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                    <span className="text-green-700 dark:text-green-400">API Key Set</span>
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
                    <Key className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                    <span className="text-yellow-700 dark:text-yellow-400">No API Key</span>
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
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* AI Chat Component - Task 6 ✅ */}
          <ErrorBoundary>
            <div className="lg:col-span-1 h-[600px] md:h-[700px]">
              <AIChat />
            </div>
          </ErrorBoundary>

          {/* Recipe Generator Component - Task 7 ✅ */}
          <ErrorBoundary>
            <div className="lg:col-span-1 h-[600px] md:h-[700px]">
              <RecipeGenerator />
            </div>
          </ErrorBoundary>

          {/* Simple AI Query Component - Task 8 ✅ */}
          <ErrorBoundary>
            <div className="lg:col-span-1 h-[600px] md:h-[700px]">
              <SimpleAIQuery apiKey={apiKey} />
            </div>
          </ErrorBoundary>
        </div>

        {/* Implementation Status */}
        <div className="mt-6 md:mt-8 rounded-lg border bg-card p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Implementation Status</h2>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Task 6: AI Chat</strong> - Conversational AI with BufferMemory (10 messages)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Task 7: Recipe Generator</strong> - Template-driven prompts with PromptTemplate</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Task 8: Simple AI Query</strong> - Direct LLM invocation (no memory)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Task 9: Dashboard Layout</strong> - Responsive grid with error boundaries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}

export default App

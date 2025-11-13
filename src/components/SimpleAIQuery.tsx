/**
 * SimpleAIQuery Component - FIXED VERSION
 *
 * Simple question-answer interface with direct LLM calls (no memory).
 * Each query is independent with no conversation history.
 *
 * Features:
 * - Direct ChatOpenAI.invoke() calls without memory
 * - React Query for state management and caching
 * - LangSmith tracing for debugging
 * - Example questions for quick testing
 * - Enhanced error display for debugging
 * - English-only responses
 */

import { useState } from 'react';
import { Loader2, X, AlertCircle } from 'lucide-react';
import { useAIQuery } from '@/hooks/useAIQuery';
import { isValidApiKey } from '@/lib/chatConfig';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface SimpleAIQueryProps {
  apiKey: string | null;
}

/**
 * Example questions for quick testing
 */
const EXAMPLE_QUESTIONS = [
  'What is the difference between AI and ML?',
  'How does blockchain work?',
  'Explain REST APIs'
];

export function SimpleAIQuery({ apiKey }: SimpleAIQueryProps) {
  const [question, setQuestion] = useState('');
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const aiQuery = useAIQuery();

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (!apiKey) {
      toast.error('Please configure your OpenAI API key first');
      return;
    }

    // Validate API key format
    if (!isValidApiKey(apiKey)) {
      toast.error('Invalid API key format. OpenAI keys must start with "sk-" and be at least 20 characters long. Please update your API key in settings.');
      return;
    }

    // Clear previous response and show debug info
    setCurrentResponse(null);
    setDebugInfo(`Sending query: "${question.trim().substring(0, 50)}..."\nAPI Key: ${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}\nTimestamp: ${new Date().toISOString()}`);

    try {
      const result = await aiQuery.mutateAsync({
        query: question.trim(),
        apiKey,
      });

      setCurrentResponse(result.response);
      setDebugInfo(null);
      toast.success('Query completed successfully');
    } catch (error) {
      console.error('Query failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setDebugInfo(`❌ ERROR:\n${errorMessage}\n\nFull error: ${JSON.stringify(error, null, 2)}`);
      toast.error(`Query failed: ${errorMessage}`);
    }
  };

  const handleExampleClick = async (exampleQuestion: string) => {
    setQuestion(exampleQuestion);

    if (!apiKey) {
      toast.error('Please configure your OpenAI API key first');
      return;
    }

    // Validate API key format
    if (!isValidApiKey(apiKey)) {
      toast.error('Invalid API key format. OpenAI keys must start with "sk-" and be at least 20 characters long. Please update your API key in settings.');
      return;
    }

    // Clear previous response and show debug info
    setCurrentResponse(null);
    setDebugInfo(`Sending example query: "${exampleQuestion}"\nAPI Key: ${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}\nTimestamp: ${new Date().toISOString()}`);

    try {
      const result = await aiQuery.mutateAsync({
        query: exampleQuestion,
        apiKey,
      });

      setCurrentResponse(result.response);
      setDebugInfo(null);
      toast.success('Query completed successfully');
    } catch (error) {
      console.error('Query failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setDebugInfo(`❌ ERROR:\n${errorMessage}\n\nFull error: ${JSON.stringify(error, null, 2)}`);
      toast.error(`Query failed: ${errorMessage}`);
    }
  };

  const handleClear = () => {
    setCurrentResponse(null);
    setQuestion('');
    setDebugInfo(null);
    toast.success('Cleared');
  };

  const isLoading = aiQuery.isPending;
  const hasError = aiQuery.isError;

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Simple AI Query</CardTitle>
        <CardDescription>
          Ask any question - each query is independent with no memory
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col min-h-0">
        {/* Example Questions */}
        <div className="space-y-2 flex-shrink-0">
          <p className="text-sm font-medium">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => handleExampleClick(example)}
                disabled={!apiKey || isLoading}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>

        {/* Question Input */}
        <div className="space-y-2 flex-shrink-0">
          <Textarea
            placeholder="Ask me anything..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={!apiKey || isLoading}
            rows={3}
            className="resize-none"
            onKeyDown={(e) => {
              // Submit on Ctrl+Enter or Cmd+Enter
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
          <Button
            onClick={handleSubmit}
            disabled={!apiKey || !question.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              'Ask Question'
            )}
          </Button>
        </div>

        {/* Response Display */}
        <div className="space-y-2 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between flex-shrink-0">
            <p className="text-sm font-medium">Response:</p>
            {(currentResponse || debugInfo) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="gap-2 h-8"
                title="Clear response"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
          <ScrollArea className="flex-1 w-full rounded-md border p-4">
            {isLoading ? (
              <SkeletonLoader />
            ) : hasError || debugInfo?.includes('ERROR') ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="font-semibold">Error occurred</p>
                    <p className="text-sm">
                      {aiQuery.error?.message || 'Failed to process your question.'}
                    </p>
                  </div>
                </div>
                {debugInfo && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs font-mono whitespace-pre-wrap">{debugInfo}</p>
                  </div>
                )}
                <div className="border-t pt-3 space-y-2">
                  <p className="text-sm font-medium">Common issues on GitHub Pages:</p>
                  <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                    <li>Check if your API key is valid at platform.openai.com</li>
                    <li>Verify you have credits available in your OpenAI account</li>
                    <li>Check browser console (F12) for CORS errors</li>
                    <li>Ensure your API key has proper permissions</li>
                  </ul>
                </div>
              </div>
            ) : currentResponse ? (
              <div className="whitespace-pre-wrap break-words text-sm">
                {currentResponse}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Ask a question or try one of the examples above to get started.
              </p>
            )}
          </ScrollArea>
        </div>

        {!apiKey && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md flex-shrink-0">
            ℹ️ Configure your API key to start asking questions
          </div>
        )}

        {/* Debug Panel (only in development) */}
        {import.meta.env.DEV && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md flex-shrink-0 font-mono">
            Debug: API Key {apiKey ? `present (${apiKey.substring(0, 7)}...)` : 'missing'} | 
            Loading: {isLoading ? 'yes' : 'no'} | 
            Error: {hasError ? 'yes' : 'no'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton loader for loading state
 */
function SkeletonLoader() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
      <div className="h-4 bg-muted rounded w-4/5"></div>
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-2/3"></div>
    </div>
  );
}

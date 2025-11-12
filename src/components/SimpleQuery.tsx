import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChatOpenAI } from '@langchain/openai'

export function SimpleQuery() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleQuery = async () => {
    if (!query.trim()) return

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) {
      setError('Please set VITE_OPENAI_API_KEY in your environment')
      return
    }

    setLoading(true)
    setError('')
    setResponse('')

    try {
      const model = new ChatOpenAI({
        modelName: 'gpt-4-turbo-preview',
        temperature: 0.5,
        openAIApiKey: apiKey,
      })

      const result = await model.invoke(query.trim())
      setResponse(result.content as string)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pattern 3: Direct LLM Queries</CardTitle>
        <CardDescription>
          Simple, direct queries to OpenAI GPT-4 without chains or memory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Your Question
            </label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything... e.g., Explain quantum computing in simple terms"
              rows={4}
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleQuery}
            disabled={loading || !query.trim()}
            className="w-full"
          >
            {loading ? 'Getting Answer...' : 'Ask AI'}
          </Button>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        {response && (
          <div className="mt-4 border rounded-md p-4 bg-muted/50">
            <h3 className="text-lg font-semibold mb-3">AI Response</h3>
            <div className="whitespace-pre-wrap text-sm">{response}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { AIMessage, HumanMessage, BaseMessage } from '@langchain/core/messages'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ConversationalAI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatHistory, setChatHistory] = useState<BaseMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSend = async () => {
    if (!input.trim()) return

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) {
      setError('Please set VITE_OPENAI_API_KEY in your environment')
      return
    }

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const model = new ChatOpenAI({
        modelName: 'gpt-4-turbo-preview',
        temperature: 0.7,
        openAIApiKey: apiKey,
      })

      // Create a prompt template with memory
      const prompt = ChatPromptTemplate.fromMessages([
        ['system', 'You are a helpful AI assistant. Have a natural conversation with the user.'],
        new MessagesPlaceholder('history'),
        ['human', '{input}'],
      ])

      // Create chain with history
      const chain = prompt.pipe(model)
      
      // Invoke with chat history
      const response = await chain.invoke({
        input: userMessage.content,
        history: chatHistory,
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content as string,
      }
      setMessages((prev) => [...prev, assistantMessage])
      
      // Update chat history
      setChatHistory((prev) => [
        ...prev,
        new HumanMessage(userMessage.content),
        new AIMessage(response.content as string),
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([])
    setChatHistory([])
    setError('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pattern 1: Conversational AI with Memory</CardTitle>
        <CardDescription>
          Chat with AI that remembers your conversation context using BufferMemory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-96 overflow-y-auto border rounded-md p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-muted-foreground text-center">
              Start a conversation...
            </p>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm font-semibold mb-1">
                  {msg.role === 'user' ? 'You' : 'AI'}
                </p>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <p className="text-sm">AI is thinking...</p>
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            Send
          </Button>
          <Button variant="outline" onClick={handleClear} disabled={loading}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

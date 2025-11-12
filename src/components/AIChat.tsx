/**
 * AIChat Component
 *
 * Conversational AI interface with memory management.
 * Implements Pattern #1: Conversational AI with memory (BufferMemory)
 *
 * Features:
 * - Message history display with auto-scroll
 * - Conversation memory (10 messages)
 * - Loading states and error handling
 * - Example prompts for quick start
 * - Responsive design with text wrapping
 *
 * Task 6 Implementation:
 * - 6.1: Component structure with message interface ✅
 * - 6.2: Scrollable message display with proper styling ✅
 * - 6.3: Conversation memory via useAIChat hook ✅
 * - 6.4: Loading states and example prompts ✅
 */

import { useState, useRef, useEffect } from 'react';
import { useAIChat } from '@/hooks/useAIChat';
import { useApiKey } from '@/hooks/useApiKey';
import { isValidApiKey } from '@/lib/chatConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Trash2, User, Bot, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

// Example prompts for quick start
const EXAMPLE_PROMPTS = [
  'Tell me a joke',
  'Explain React hooks',
  'What is AI?',
];

/**
 * AIChat Component
 *
 * @example
 * ```tsx
 * <AIChat />
 * ```
 */
export function AIChat() {
  const { apiKey } = useApiKey();
  const [input, setInput] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize chat with conversation memory (max 10 messages)
  const chat = useAIChat({
    maxMessages: 10,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages]);

  // Track scroll position to show/hide scroll button
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && chat.messages.length > 0);
    }
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  /**
   * Handle message submission
   */
  const handleSend = async () => {
    if (!input.trim()) {
      toast.error('Please enter a message');
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

    try {
      await chat.sendMessage({
        message: input.trim(),
        apiKey,
      });
      setInput(''); // Clear input after successful send
      toast.success('Message sent!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(errorMessage);
    }
  };

  /**
   * Handle example prompt click
   */
  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  /**
   * Handle Enter key press (Shift+Enter for new line)
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Clear conversation history
   */
  const handleClear = () => {
    chat.clearHistory();
    toast.success('Conversation cleared');
  };

  /**
   * Skeleton loader for chat messages
   */
  const ChatSkeleton = () => (
    <div className="flex gap-3 justify-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="max-w-[80%] rounded-lg bg-muted p-3 space-y-2 animate-pulse">
        <div className="h-3 bg-muted-foreground/20 rounded w-48"></div>
        <div className="h-3 bg-muted-foreground/20 rounded w-64"></div>
        <div className="h-3 bg-muted-foreground/20 rounded w-40"></div>
      </div>
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Chat
        </CardTitle>
        <CardDescription>
          Conversational AI with memory. The AI remembers the last 10 messages.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        {/* Message Display Area - Subtask 6.2 */}
        <div className="relative">
          <ScrollArea
            className="flex-1 h-[500px] border rounded-lg p-4"
            ref={scrollRef}
            onScroll={handleScroll}
          >
          <div className="space-y-4">
            {chat.messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No messages yet. Start a conversation!</p>
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold">Try these examples:</p>
                  {EXAMPLE_PROMPTS.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(prompt)}
                      className="mx-1"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              chat.messages.map((message) => (
                <div
                  key={message.timestamp}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg p-3 break-words ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Loading Indicator - Subtask 6.4 with Skeleton */}
            {chat.isLoading && <ChatSkeleton />}
          </div>
          </ScrollArea>

          {/* Scroll to Bottom Button */}
          {showScrollButton && (
            <Button
              onClick={scrollToBottom}
              size="icon"
              className="absolute bottom-4 right-4 h-10 w-10 rounded-full shadow-lg"
              title="Scroll to bottom"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="flex-1 min-h-[80px] resize-none"
              disabled={chat.isLoading || !apiKey}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSend}
                disabled={chat.isLoading || !input.trim() || !apiKey}
                size="icon"
                className="h-10 w-10"
              >
                {chat.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={handleClear}
                disabled={chat.messages.length === 0}
                variant="outline"
                size="icon"
                className="h-10 w-10"
                title="Clear conversation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Example Prompts - Subtask 6.4 */}
          {chat.messages.length === 0 && !chat.isLoading && (
            <div className="flex flex-wrap gap-2">
              <p className="text-xs text-muted-foreground w-full">Quick start:</p>
              {EXAMPLE_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleExampleClick(prompt)}
                  disabled={!apiKey}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* API Key Warning */}
        {!apiKey && (
          <div className="text-sm text-muted-foreground text-center">
            Please configure your OpenAI API key to start chatting
          </div>
        )}
      </CardContent>
    </Card>
  );
}

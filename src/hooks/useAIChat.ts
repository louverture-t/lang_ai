/**
 * useAIChat Hook
 *
 * Conversational AI hook with memory management.
 * Maintains conversation history and context.
 *
 * Features:
 * - Message history management (manual buffer)
 * - Configurable memory limit (10 messages default)
 * - Message persistence during session
 * - Automatic context management
 */

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createChatModel } from '@/lib/chatConfig';
import { parseAIError, validateApiKey, retryConfig } from '@/lib/errorHandling';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

/**
 * Chat message structure
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * Input for sending a chat message
 */
export interface ChatInput {
  message: string;
  apiKey: string;
}

/**
 * Configuration options for chat hook
 */
export interface ChatConfig {
  /**
   * Maximum number of messages to keep in memory
   * @default 10
   */
  maxMessages?: number;

  /**
   * Initial messages to populate the chat
   * @default []
   */
  initialMessages?: ChatMessage[];
}

/**
 * Hook for conversational AI with memory
 *
 * @param config - Configuration options
 * @returns Chat functions and state
 *
 * @example
 * ```typescript
 * const chat = useAIChat({ maxMessages: 10 });
 *
 * const handleSend = async (message: string) => {
 *   await chat.sendMessage({ message, apiKey: userApiKey });
 * };
 *
 * return (
 *   <div>
 *     {chat.messages.map(msg => (
 *       <div key={msg.timestamp}>
 *         <strong>{msg.role}:</strong> {msg.content}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useAIChat(config: ChatConfig = {}) {
  const { maxMessages = 10, initialMessages = [] } = config;

  // State for conversation history
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Mutation for sending messages
  const mutation = useMutation<ChatMessage, Error, ChatInput>({
    mutationKey: ['ai-chat'],

    mutationFn: async ({ message, apiKey }: ChatInput) => {
      // Validate API key
      validateApiKey(apiKey);

      try {
        // Create chat model
        const chatModel = createChatModel(apiKey);

        // Convert chat history to LangChain message format
        const messageHistory = messages.slice(-maxMessages * 2).map((msg) => {
          if (msg.role === 'user') {
            return new HumanMessage(msg.content);
          } else {
            return new AIMessage(msg.content);
          }
        });

        // Add current user message
        messageHistory.push(new HumanMessage(message));

        // Invoke the model with conversation history
        const response = await chatModel.invoke(messageHistory);

        // Extract response content
        const content =
          typeof response.content === 'string'
            ? response.content
            : JSON.stringify(response.content);

        // Create assistant message
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content,
          timestamp: Date.now(),
        };

        return assistantMessage;
      } catch (error) {
        throw parseAIError(error);
      }
    },

    // Error handling configuration
    ...retryConfig,

    // Success callback - add messages to state
    onSuccess: (assistantMessage, variables) => {
      setMessages((prev) => {
        const userMessage: ChatMessage = {
          role: 'user',
          content: variables.message,
          timestamp: Date.now() - 1, // Ensure user message is before assistant
        };

        const newMessages = [...prev, userMessage, assistantMessage];

        // Limit message history
        if (newMessages.length > maxMessages * 2) {
          return newMessages.slice(-maxMessages * 2);
        }

        return newMessages;
      });
    },

    // Error callback
    onError: (error) => {
      console.error('[AI Chat Error]', { error: parseAIError(error) });
    },
  });

  /**
   * Send a message to the AI
   */
  const sendMessage = useCallback(
    async (input: ChatInput) => {
      return await mutation.mutateAsync(input);
    },
    [mutation]
  );

  /**
   * Clear conversation history
   */
  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Reset to initial state with optional new messages
   */
  const reset = useCallback(
    (newMessages: ChatMessage[] = []) => {
      setMessages(newMessages);
    },
    []
  );

  return {
    // State
    messages,
    isLoading: mutation.isPending,
    error: mutation.error,

    // Actions
    sendMessage,
    clearHistory,
    reset,

    // Mutation object for advanced usage
    mutation,
  };
}

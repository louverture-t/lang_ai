/**
 * useAIQuery Hook
 *
 * Simple AI query hook for direct LLM interactions.
 * Uses React Query for caching and state management.
 *
 * Features:
 * - Direct ChatOpenAI invocation (no memory)
 * - Automatic caching (5 minutes)
 * - Error handling with retries
 * - Loading and error states
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChatModel } from '@/lib/chatConfig';
import { parseAIError, validateApiKey, retryConfig } from '@/lib/errorHandling';
import { formatSimpleQuery } from '@/lib/templates';

/**
 * Input parameters for AI query
 */
export interface AIQueryInput {
  query: string;
  apiKey: string;
}

/**
 * Result from AI query
 */
export interface AIQueryResult {
  response: string;
  query: string;
  timestamp: number;
}

/**
 * Hook for simple AI queries
 *
 * @returns Mutation object with execute function and states
 *
 * @example
 * ```typescript
 * const aiQuery = useAIQuery();
 *
 * const handleQuery = async () => {
 *   try {
 *     const result = await aiQuery.mutateAsync({
 *       query: "What is the capital of France?",
 *       apiKey: userApiKey
 *     });
 *     console.log(result.response);
 *   } catch (error) {
 *     console.error("Query failed:", error);
 *   }
 * };
 * ```
 */
export function useAIQuery() {
  const queryClient = useQueryClient();

  return useMutation<AIQueryResult, Error, AIQueryInput>({
    mutationKey: ['ai-query'],

    mutationFn: async ({ query, apiKey }: AIQueryInput) => {
      // Validate API key
      validateApiKey(apiKey);

      try {
        // Create chat model
        const chatModel = createChatModel(apiKey);

        // Format prompt using template
        const prompt = await formatSimpleQuery(query);

        // Invoke the model
        const response = await chatModel.invoke(prompt);

        // Extract response text
        const responseText =
          typeof response.content === 'string'
            ? response.content
            : JSON.stringify(response.content);

        return {
          response: responseText,
          query,
          timestamp: Date.now(),
        };
      } catch (error) {
        throw parseAIError(error);
      }
    },

    // Error handling configuration
    ...retryConfig,

    // Success callback
    onSuccess: (data) => {
      console.log('[AI Query Success]', { query: data.query });
    },

    // Error callback
    onError: (error) => {
      console.error('[AI Query Error]', { error: parseAIError(error) });
    },

    // Cache the result for reuse
    onSettled: (data) => {
      if (data) {
        queryClient.setQueryData(['ai-query', data.query], data);
      }
    },
  });
}

/**
 * Hook to get cached query results
 *
 * @param query - The query to retrieve cached results for
 * @returns Cached query result or undefined
 */
export function useCachedQuery(query: string): AIQueryResult | undefined {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<AIQueryResult>(['ai-query', query]);
}

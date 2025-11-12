/**
 * React Query Configuration
 *
 * Centralized configuration for @tanstack/react-query.
 * Provides caching, automatic refetching, and error handling for async state.
 *
 * Key Features:
 * - 5-minute stale time for AI responses (reduces unnecessary API calls)
 * - Automatic retry on failure (3 attempts with exponential backoff)
 * - Query caching for improved performance
 * - Error boundary integration
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Create and configure the React Query client
 *
 * Configuration:
 * - staleTime: 5 minutes - AI responses are considered fresh for this duration
 * - cacheTime: 10 minutes - Keep unused data in cache for faster re-mounting
 * - retry: 3 attempts - Retry failed queries with exponential backoff
 * - refetchOnWindowFocus: false - Don't refetch when user returns to tab
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Consider data fresh for 5 minutes (reduces API calls)
      staleTime: 1000 * 60 * 5, // 5 minutes

      // Keep unused data in cache for 10 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)

      // Retry failed queries up to 3 times
      retry: 3,

      // Don't refetch on window focus (prevents unnecessary API calls)
      refetchOnWindowFocus: false,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,

      // Global mutation error handler
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

/**
 * Clear all cached queries
 * Useful for forcing a complete refresh of all AI responses
 */
export function clearQueryCache(): void {
  queryClient.clear();
}

/**
 * Invalidate specific query by key
 * Forces a refetch of data for the given query key
 *
 * @param queryKey - The query key to invalidate (e.g., ['ai-chat'], ['recipe', id])
 */
export function invalidateQuery(queryKey: string[]): void {
  queryClient.invalidateQueries({ queryKey });
}

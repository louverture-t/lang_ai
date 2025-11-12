/**
 * Error Handling Utilities for React Query and LangChain
 *
 * Centralized error handling for consistent user experience.
 * Provides user-friendly error messages and retry logic.
 */

/**
 * Custom error class for AI operation errors
 */
export class AIError extends Error {
  public readonly code: string;
  public readonly isRetryable: boolean;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', isRetryable: boolean = true) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.isRetryable = isRetryable;
  }
}

/**
 * Error codes for different error types
 */
export const ERROR_CODES = {
  NO_API_KEY: 'NO_API_KEY',
  INVALID_API_KEY: 'INVALID_API_KEY',
  RATE_LIMIT: 'RATE_LIMIT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  MODEL_ERROR: 'MODEL_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const;

/**
 * Parse error from LangChain/OpenAI operations
 *
 * @param error - Error object from failed operation
 * @returns AIError with user-friendly message
 */
export function parseAIError(error: unknown): AIError {
  // Handle AIError instances
  if (error instanceof AIError) {
    return error;
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // No API key configured
    if (message.includes('api key') && message.includes('not')) {
      return new AIError(
        'OpenAI API key not configured. Please add your API key in settings.',
        ERROR_CODES.NO_API_KEY,
        false
      );
    }

    // Invalid API key
    if (message.includes('invalid') || message.includes('unauthorized')) {
      return new AIError(
        'Invalid API key. Please check your OpenAI API key in settings.',
        ERROR_CODES.INVALID_API_KEY,
        false
      );
    }

    // Rate limit exceeded
    if (message.includes('rate limit') || message.includes('429')) {
      return new AIError(
        'API rate limit exceeded. Please wait a moment and try again.',
        ERROR_CODES.RATE_LIMIT,
        true
      );
    }

    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return new AIError(
        'Network error. Please check your internet connection and try again.',
        ERROR_CODES.NETWORK_ERROR,
        true
      );
    }

    // Timeout errors
    if (message.includes('timeout')) {
      return new AIError(
        'Request timed out. The AI model is taking too long to respond. Please try again.',
        ERROR_CODES.TIMEOUT,
        true
      );
    }

    // Model-specific errors
    if (message.includes('model')) {
      return new AIError(
        'AI model error. The model encountered an issue. Please try again.',
        ERROR_CODES.MODEL_ERROR,
        true
      );
    }

    // Generic error with original message
    return new AIError(error.message, ERROR_CODES.UNKNOWN, true);
  }

  // Unknown error type
  return new AIError(
    'An unexpected error occurred. Please try again.',
    ERROR_CODES.UNKNOWN,
    true
  );
}

/**
 * Get user-friendly error message
 *
 * @param error - Error object
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  const aiError = parseAIError(error);
  return aiError.message;
}

/**
 * Determine if error is retryable
 *
 * @param error - Error object
 * @returns true if operation should be retried
 */
export function isRetryableError(error: unknown): boolean {
  const aiError = parseAIError(error);
  return aiError.isRetryable;
}

/**
 * Retry configuration for React Query
 */
export const retryConfig = {
  /**
   * Custom retry function for React Query
   * Only retries if error is retryable and within attempt limit
   */
  retry: (failureCount: number, error: unknown) => {
    // Maximum 3 retry attempts
    if (failureCount >= 3) {
      return false;
    }

    // Only retry if error is retryable
    return isRetryableError(error);
  },

  /**
   * Exponential backoff delay between retries
   * 1st retry: 1s, 2nd: 2s, 3rd: 4s
   */
  retryDelay: (attemptIndex: number) => {
    return Math.min(1000 * 2 ** attemptIndex, 30000);
  },
};

/**
 * Global error handler for React Query mutations
 *
 * @param error - Error object from failed mutation
 */
export function handleMutationError(error: unknown): void {
  const aiError = parseAIError(error);

  // Log error for debugging
  console.error('[AI Mutation Error]', {
    code: aiError.code,
    message: aiError.message,
    isRetryable: aiError.isRetryable,
  });

  // Additional error reporting could be added here
  // e.g., send to error tracking service, show toast notification, etc.
}

/**
 * Validate API key before making requests
 *
 * @param apiKey - API key to validate
 * @throws AIError if API key is invalid
 */
export function validateApiKey(apiKey: string | undefined | null): void {
  if (!apiKey) {
    throw new AIError(
      'OpenAI API key not configured. Please add your API key in settings.',
      ERROR_CODES.NO_API_KEY,
      false
    );
  }

  if (!apiKey.startsWith('sk-')) {
    throw new AIError(
      'Invalid API key format. OpenAI API keys should start with "sk-".',
      ERROR_CODES.INVALID_API_KEY,
      false
    );
  }

  if (apiKey.length < 20) {
    throw new AIError(
      'Invalid API key. The key appears to be too short.',
      ERROR_CODES.INVALID_API_KEY,
      false
    );
  }
}

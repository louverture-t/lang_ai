/**
 * LangChain ChatOpenAI Configuration
 *
 * Centralized configuration for OpenAI chat models.
 * Creates configured ChatOpenAI instances with consistent settings.
 *
 * Model: GPT-4.1-mini (fast, cost-effective, good quality)
 * Temperature: 0.7 (balanced creativity and consistency)
 */

import { ChatOpenAI } from '@langchain/openai';

/**
 * Default model configuration
 */
export const DEFAULT_MODEL_CONFIG = {
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1000,
} as const;

/**
 * Create a configured ChatOpenAI instance
 *
 * @param apiKey - OpenAI API key (required)
 * @param options - Optional configuration overrides
 * @returns Configured ChatOpenAI instance
 *
 * @example
 * ```typescript
 * const chat = createChatModel(apiKey);
 * const response = await chat.invoke("Hello!");
 * ```
 *
 * @example
 * ```typescript
 * // Custom temperature for more creative responses
 * const chat = createChatModel(apiKey, { temperature: 0.9 });
 * ```
 */
export function createChatModel(
  apiKey: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    modelName?: string;
  }
): ChatOpenAI {
  // DEBUG: Log API key info
  console.log('🤖 createChatModel called:', {
    hasApiKey: !!apiKey,
    apiKeyType: typeof apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyPrefix: apiKey?.substring(0, 7) || 'none',
    isValid: apiKey?.startsWith('sk-'),
  });

  if (!apiKey || !apiKey.startsWith('sk-')) {
    throw new Error(
      'Invalid OpenAI API key. API key must start with "sk-". ' +
        'Get your API key at: https://platform.openai.com/api-keys'
    );
  }

  console.log('✅ Creating ChatOpenAI instance with valid key');

  return new ChatOpenAI({
    modelName: options?.modelName || DEFAULT_MODEL_CONFIG.modelName,
    temperature: options?.temperature ?? DEFAULT_MODEL_CONFIG.temperature,
    maxTokens: options?.maxTokens || DEFAULT_MODEL_CONFIG.maxTokens,
    apiKey: apiKey, // Primary parameter (openAIApiKey is an alias)
    // Enable streaming for real-time responses (optional)
    streaming: false,
  });
}

/**
 * Create a streaming ChatOpenAI instance
 *
 * Use this for real-time streaming responses in chat interfaces.
 *
 * @param apiKey - OpenAI API key (required)
 * @param options - Optional configuration overrides
 * @returns Configured ChatOpenAI instance with streaming enabled
 *
 * @example
 * ```typescript
 * const chat = createStreamingChatModel(apiKey);
 * const stream = await chat.stream("Tell me a story");
 * for await (const chunk of stream) {
 *   console.log(chunk.content);
 * }
 * ```
 */
export function createStreamingChatModel(
  apiKey: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    modelName?: string;
  }
): ChatOpenAI {
  const model = createChatModel(apiKey, options);
  // Enable streaming for this instance
  model.streaming = true;
  return model;
}

/**
 * Validate OpenAI API key format
 *
 * @param apiKey - API key to validate
 * @returns true if valid format, false otherwise
 */
export function isValidApiKey(apiKey: string | undefined): boolean {
  return typeof apiKey === 'string' && apiKey.startsWith('sk-') && apiKey.length > 20;
}

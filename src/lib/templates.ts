/**
 * LangChain PromptTemplate Helpers
 *
 * Centralized prompt templates for consistent AI interactions.
 * Templates provide structure and consistency for complex prompts.
 *
 * Benefits:
 * - Reusable prompt structures
 * - Type-safe template variables
 * - Easy maintenance and updates
 * - Consistent AI behavior
 */

import { PromptTemplate } from '@langchain/core/prompts';

/**
 * Recipe Generation Template
 *
 * Generates recipes based on cuisine, dish type, tone, and number of steps.
 *
 * Variables:
 * - tone: Writing style (e.g., "professional", "casual", "humorous")
 * - cuisine: Type of cuisine (e.g., "Italian", "Chinese", "Mexican")
 * - dish: Dish name or description
 * - steps: Number of cooking steps (as string)
 */
export const recipeTemplate = new PromptTemplate({
  template: `You are a professional chef and recipe writer. Create a detailed recipe with the following specifications:

Tone: {tone}
Cuisine: {cuisine}
Dish: {dish}
Number of Steps: {steps}

Please provide:
1. A brief introduction (2-3 sentences)
2. Ingredients list (with measurements)
3. Step-by-step cooking instructions (exactly {steps} steps)
4. Cooking tips and variations

IMPORTANT: Respond only in English. Keep the tone {tone} throughout. Make it authentic to {cuisine} cuisine.`,
  inputVariables: ['tone', 'cuisine', 'dish', 'steps'],
});

/**
 * Simple AI Query Template
 *
 * General-purpose template for straightforward questions.
 * Ensures responses are clear, concise, and in English.
 *
 * Variables:
 * - query: The user's question
 */
export const simpleQueryTemplate = new PromptTemplate({
  template: `Answer the following question clearly and concisely in English:

Question: {query}

Provide a helpful, accurate answer. If you're not sure, say so.`,
  inputVariables: ['query'],
});

/**
 * Conversational Chat Template
 *
 * Template for conversational AI with context awareness.
 * Maintains friendly, helpful tone across interactions.
 *
 * Variables:
 * - input: User's message
 * - chat_history: Previous conversation (optional)
 */
export const chatTemplate = new PromptTemplate({
  template: `You are a helpful, friendly AI assistant. Have a natural conversation with the user.
Always respond in English.

{chat_history}
Human: {input}
AI: `,
  inputVariables: ['input', 'chat_history'],
});

/**
 * Format recipe template with provided values
 *
 * @param params - Recipe parameters
 * @returns Formatted prompt string
 *
 * @example
 * ```typescript
 * const prompt = await formatRecipePrompt({
 *   tone: 'professional',
 *   cuisine: 'Italian',
 *   dish: 'Carbonara',
 *   steps: '5'
 * });
 * ```
 */
export async function formatRecipePrompt(params: {
  tone: string;
  cuisine: string;
  dish: string;
  steps: string;
}): Promise<string> {
  return await recipeTemplate.format(params);
}

/**
 * Format simple query template
 *
 * @param query - User's question
 * @returns Formatted prompt string
 *
 * @example
 * ```typescript
 * const prompt = await formatSimpleQuery("What is the capital of France?");
 * ```
 */
export async function formatSimpleQuery(query: string): Promise<string> {
  return await simpleQueryTemplate.format({ query });
}

/**
 * Format chat template with conversation history
 *
 * @param input - User's current message
 * @param chatHistory - Previous conversation context
 * @returns Formatted prompt string
 *
 * @example
 * ```typescript
 * const prompt = await formatChatPrompt(
 *   "Tell me more about React",
 *   "Human: What is React?\nAI: React is a JavaScript library..."
 * );
 * ```
 */
export async function formatChatPrompt(
  input: string,
  chatHistory: string = ''
): Promise<string> {
  return await chatTemplate.format({
    input,
    chat_history: chatHistory,
  });
}

/**
 * Template input types for type safety
 */
export interface RecipeTemplateInput {
  tone: string;
  cuisine: string;
  dish: string;
  steps: string;
}

export interface SimpleQueryInput {
  query: string;
}

export interface ChatTemplateInput {
  input: string;
  chat_history?: string;
}

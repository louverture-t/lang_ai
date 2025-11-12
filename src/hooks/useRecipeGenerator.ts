/**
 * useRecipeGenerator Hook
 *
 * Template-driven recipe generation using LangChain PromptTemplate.
 * Demonstrates structured prompting with multiple parameters.
 *
 * Features:
 * - PromptTemplate integration
 * - Type-safe recipe parameters
 * - Local storage for saved recipes
 * - React Query caching
 */

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChatModel } from '@/lib/chatConfig';
import { parseAIError, validateApiKey, retryConfig } from '@/lib/errorHandling';
import { formatRecipePrompt } from '@/lib/templates';
import type { RecipeTemplateInput } from '@/lib/templates';

/**
 * Recipe generation input
 */
export interface RecipeInput extends RecipeTemplateInput {
  apiKey: string;
}

/**
 * Generated recipe structure
 */
export interface Recipe {
  id: string;
  tone: string;
  cuisine: string;
  dish: string;
  steps: string;
  content: string;
  timestamp: number;
}

/**
 * LocalStorage key for saved recipes
 */
const STORAGE_KEY = 'saved-recipes';

/**
 * Hook for recipe generation with template-driven prompts
 *
 * @returns Recipe generation functions and state
 *
 * @example
 * ```typescript
 * const recipeGen = useRecipeGenerator();
 *
 * const handleGenerate = async () => {
 *   const recipe = await recipeGen.generateRecipe({
 *     tone: 'professional',
 *     cuisine: 'Italian',
 *     dish: 'Carbonara',
 *     steps: '5',
 *     apiKey: userApiKey
 *   });
 *   console.log(recipe.content);
 * };
 * ```
 */
export function useRecipeGenerator() {
  const queryClient = useQueryClient();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    // Load saved recipes from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load saved recipes:', error);
      return [];
    }
  });

  // Mutation for generating recipes
  const mutation = useMutation<Recipe, Error, RecipeInput>({
    mutationKey: ['recipe-generation'],

    mutationFn: async ({ tone, cuisine, dish, steps, apiKey }: RecipeInput) => {
      // Validate API key
      validateApiKey(apiKey);

      try {
        // Create chat model
        const chatModel = createChatModel(apiKey, {
          temperature: 0.8, // Higher temperature for more creative recipes
          maxTokens: 1500, // Allow longer responses for recipes
        });

        // Format prompt using recipe template
        const prompt = await formatRecipePrompt({ tone, cuisine, dish, steps });

        // Invoke the model
        const response = await chatModel.invoke(prompt);

        // Extract response text
        const content =
          typeof response.content === 'string'
            ? response.content
            : JSON.stringify(response.content);

        // Create recipe object
        const recipe: Recipe = {
          id: `recipe-${Date.now()}`,
          tone,
          cuisine,
          dish,
          steps,
          content,
          timestamp: Date.now(),
        };

        return recipe;
      } catch (error) {
        throw parseAIError(error);
      }
    },

    // Error handling configuration
    ...retryConfig,

    // Success callback
    onSuccess: (recipe) => {
      console.log('[Recipe Generated]', {
        dish: recipe.dish,
        cuisine: recipe.cuisine,
      });

      // Cache the recipe
      queryClient.setQueryData(['recipe', recipe.id], recipe);
    },

    // Error callback
    onError: (error) => {
      console.error('[Recipe Generation Error]', { error: parseAIError(error) });
    },
  });

  /**
   * Generate a new recipe
   */
  const generateRecipe = useCallback(
    async (input: RecipeInput) => {
      return await mutation.mutateAsync(input);
    },
    [mutation]
  );

  /**
   * Save a recipe to localStorage
   */
  const saveRecipe = useCallback(
    (recipe: Recipe) => {
      setSavedRecipes((prev) => {
        const updated = [...prev, recipe];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error('Failed to save recipe:', error);
        }
        return updated;
      });
    },
    []
  );

  /**
   * Delete a saved recipe
   */
  const deleteRecipe = useCallback((recipeId: string) => {
    setSavedRecipes((prev) => {
      const updated = prev.filter((r) => r.id !== recipeId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to delete recipe:', error);
      }
      return updated;
    });
  }, []);

  /**
   * Clear all saved recipes
   */
  const clearSavedRecipes = useCallback(() => {
    setSavedRecipes([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear recipes:', error);
    }
  }, []);

  /**
   * Get a saved recipe by ID
   */
  const getRecipeById = useCallback(
    (recipeId: string): Recipe | undefined => {
      return savedRecipes.find((r) => r.id === recipeId);
    },
    [savedRecipes]
  );

  return {
    // State
    isLoading: mutation.isPending,
    error: mutation.error,
    savedRecipes,

    // Actions
    generateRecipe,
    saveRecipe,
    deleteRecipe,
    clearSavedRecipes,
    getRecipeById,

    // Mutation object for advanced usage
    mutation,
  };
}

/**
 * Example recipe parameters for quick testing
 */
export const EXAMPLE_RECIPES: Omit<RecipeTemplateInput, 'apiKey'>[] = [
  {
    tone: 'professional',
    cuisine: 'Italian',
    dish: 'Classic Carbonara',
    steps: '5',
  },
  {
    tone: 'casual',
    cuisine: 'Chinese',
    dish: 'Vegetable Stir-Fry',
    steps: '4',
  },
  {
    tone: 'humorous',
    cuisine: 'American',
    dish: 'BBQ Ribs',
    steps: '6',
  },
  {
    tone: 'professional',
    cuisine: 'French',
    dish: 'Coq au Vin',
    steps: '8',
  },
  {
    tone: 'casual',
    cuisine: 'Mexican',
    dish: 'Fish Tacos',
    steps: '5',
  },
];

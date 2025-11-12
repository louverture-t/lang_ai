/**
 * RecipeGenerator Component
 *
 * Template-driven recipe generation using LangChain PromptTemplate.
 * Demonstrates structured prompting with multiple parameters.
 *
 * Features:
 * - Form with tone, cuisine, dish, and steps inputs
 * - PromptTemplate integration via useRecipeGenerator hook
 * - Recipe display with localStorage persistence
 * - Example buttons for quick testing
 * - Saved recipes list with delete functionality
 */

import { useState } from 'react';
import { useApiKey } from '@/hooks/useApiKey';
import { useRecipeGenerator, EXAMPLE_RECIPES } from '@/hooks/useRecipeGenerator';
import { isValidApiKey } from '@/lib/chatConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ChefHat, Save, Trash2, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Tone options for recipe generation
 */
const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'elegant', label: 'Elegant' },
] as const;

/**
 * RecipeGenerator Component
 *
 * Main component for generating and managing recipes
 */
export function RecipeGenerator() {
  const { apiKey } = useApiKey();
  const {
    isLoading,
    error,
    savedRecipes,
    generateRecipe,
    saveRecipe,
    deleteRecipe,
    clearSavedRecipes,
  } = useRecipeGenerator();

  // Form state
  const [tone, setTone] = useState<string>('professional');
  const [cuisine, setCuisine] = useState<string>('');
  const [dish, setDish] = useState<string>('');
  const [steps, setSteps] = useState<string>('5');

  // Current generated recipe
  const [currentRecipe, setCurrentRecipe] = useState<string>('');

  /**
   * Handle recipe generation
   */
  const handleGenerate = async () => {
    if (!apiKey) {
      toast.error('Please configure your OpenAI API key first');
      return;
    }

    // Validate API key format
    if (!isValidApiKey(apiKey)) {
      toast.error('Invalid API key format. OpenAI keys must start with "sk-" and be at least 20 characters long. Please update your API key in settings.');
      return;
    }

    if (!cuisine.trim() || !dish.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const recipe = await generateRecipe({
        tone,
        cuisine: cuisine.trim(),
        dish: dish.trim(),
        steps,
        apiKey,
      });

      setCurrentRecipe(recipe.content);
      toast.success('Recipe generated successfully!');
    } catch {
      toast.error(error?.message || 'Failed to generate recipe');
    }
  };

  /**
   * Handle saving current recipe
   */
  const handleSaveRecipe = () => {
    if (!currentRecipe) {
      toast.error('No recipe to save');
      return;
    }

    const recipe = {
      id: `recipe-${Date.now()}`,
      tone,
      cuisine,
      dish,
      steps,
      content: currentRecipe,
      timestamp: Date.now(),
    };

    saveRecipe(recipe);
    toast.success('Recipe saved!');
  };

  /**
   * Handle deleting a saved recipe
   */
  const handleDeleteRecipe = (recipeId: string) => {
    deleteRecipe(recipeId);
    toast.success('Recipe deleted');
  };

  /**
   * Handle clearing all saved recipes
   */
  const handleClearAll = () => {
    if (savedRecipes.length === 0) {
      toast.error('No recipes to clear');
      return;
    }

    if (confirm('Are you sure you want to delete all saved recipes?')) {
      clearSavedRecipes();
      toast.success('All recipes cleared');
    }
  };

  /**
   * Handle clearing current recipe
   */
  const handleClearCurrent = () => {
    setCurrentRecipe('');
    toast.success('Recipe cleared');
  };

  /**
   * Handle example button click
   */
  const handleExampleClick = (example: typeof EXAMPLE_RECIPES[0]) => {
    setTone(example.tone);
    setCuisine(example.cuisine);
    setDish(example.dish);
    setSteps(example.steps);
    toast.info(`Loaded example: ${example.dish}`);
  };

  /**
   * Skeleton loader for recipe generation
   */
  const RecipeSkeleton = () => (
    <ScrollArea className="h-[400px] rounded-lg border bg-muted/30 p-4">
      <div className="space-y-4 animate-pulse">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
        </div>
        {/* Ingredients skeleton */}
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-muted-foreground/20 rounded w-32"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-5/6"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-4/5"></div>
        </div>
        {/* Steps skeleton */}
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-muted-foreground/20 rounded w-40"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <div className="space-y-6">
      {/* Main Recipe Generator Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            <CardTitle>Recipe Generator</CardTitle>
          </div>
          <CardDescription>
            Generate custom recipes using LangChain PromptTemplate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Example Buttons */}
          <div className="flex flex-wrap gap-2">
            <p className="text-sm text-muted-foreground w-full mb-1">Quick Examples:</p>
            {EXAMPLE_RECIPES.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
                className="gap-2"
              >
                <Sparkles className="h-3 w-3" />
                {example.dish}
              </Button>
            ))}
          </div>

          {/* Form Inputs */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Tone Select */}
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone} disabled={isLoading}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Steps Input */}
            <div className="space-y-2">
              <Label htmlFor="steps">Number of Steps</Label>
              <Input
                id="steps"
                type="number"
                min="3"
                max="15"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                disabled={isLoading}
                placeholder="5"
              />
            </div>

            {/* Cuisine Input */}
            <div className="space-y-2">
              <Label htmlFor="cuisine">Cuisine Type *</Label>
              <Input
                id="cuisine"
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                disabled={isLoading}
                placeholder="e.g., Italian, Chinese, Mexican"
              />
            </div>

            {/* Dish Input */}
            <div className="space-y-2">
              <Label htmlFor="dish">Dish Name *</Label>
              <Input
                id="dish"
                type="text"
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                disabled={isLoading}
                placeholder="e.g., Carbonara, Stir-Fry, Tacos"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !cuisine.trim() || !dish.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              <>
                <ChefHat className="mr-2 h-4 w-4" />
                Generate Recipe
              </>
            )}
          </Button>

          {/* Loading Skeleton */}
          {isLoading && <RecipeSkeleton />}

          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              <strong>Error:</strong> {error.message}
            </div>
          )}

          {/* Generated Recipe Display */}
          {currentRecipe && !isLoading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Generated Recipe:</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveRecipe}
                    className="gap-2"
                  >
                    <Save className="h-3 w-3" />
                    Save Recipe
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCurrent}
                    className="gap-2"
                    title="Clear current recipe"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[400px] rounded-lg border bg-muted/30 p-4">
                <div className="whitespace-pre-wrap break-words text-sm">
                  {currentRecipe}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Recipes Card */}
      {savedRecipes.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Saved Recipes ({savedRecipes.length})</CardTitle>
                <CardDescription>Your recipe collection</CardDescription>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
                className="gap-2"
              >
                <Trash2 className="h-3 w-3" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {savedRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="rounded-lg border bg-card p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {recipe.dish}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="capitalize">{recipe.cuisine}</span>
                          <span>•</span>
                          <span className="capitalize">{recipe.tone}</span>
                          <span>•</span>
                          <span>{recipe.steps} steps</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        className="h-8 w-8 p-0 shrink-0"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                    <ScrollArea className="h-[120px] rounded border bg-muted/30 p-2">
                      <p className="text-xs whitespace-pre-wrap break-words">
                        {recipe.content}
                      </p>
                    </ScrollArea>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

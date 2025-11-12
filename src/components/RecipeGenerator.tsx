import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'

export function RecipeGenerator() {
  const [ingredient, setIngredient] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [recipe, setRecipe] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleGenerate = async () => {
    if (!ingredient.trim()) return

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) {
      setError('Please set VITE_OPENAI_API_KEY in your environment')
      return
    }

    setLoading(true)
    setError('')
    setRecipe('')

    try {
      const model = new ChatOpenAI({
        modelName: 'gpt-4-turbo-preview',
        temperature: 0.8,
        openAIApiKey: apiKey,
      })

      const template = `You are a professional chef. Create a detailed recipe using the following ingredient: {ingredient}.
${cuisine ? 'The recipe should be in {cuisine} cuisine style.' : ''}

Provide:
1. Recipe name
2. Ingredients list
3. Step-by-step instructions
4. Cooking time
5. Serving suggestions

Make it creative and delicious!`

      const prompt = PromptTemplate.fromTemplate(template)

      // Create chain using pipe
      const chain = prompt.pipe(model)
      const response = await chain.invoke({
        ingredient: ingredient.trim(),
        ...(cuisine && { cuisine: cuisine.trim() }),
      })

      setRecipe(response.content as string)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pattern 2: Template-Driven Prompt Engineering</CardTitle>
        <CardDescription>
          Generate recipes using structured prompt templates with PromptTemplate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Main Ingredient *
            </label>
            <Input
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="e.g., chicken, salmon, tofu"
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Cuisine Style (optional)
            </label>
            <Input
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="e.g., Italian, Thai, Mexican"
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || !ingredient.trim()}
            className="w-full"
          >
            {loading ? 'Generating Recipe...' : 'Generate Recipe'}
          </Button>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        {recipe && (
          <div className="mt-4 border rounded-md p-4 bg-muted/50">
            <h3 className="text-lg font-semibold mb-3">Generated Recipe</h3>
            <div className="whitespace-pre-wrap text-sm">{recipe}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

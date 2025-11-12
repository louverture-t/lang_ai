import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConversationalAI } from '@/components/ConversationalAI'
import { RecipeGenerator } from '@/components/RecipeGenerator'
import { SimpleQuery } from '@/components/SimpleQuery'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            LangChain Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            AI integration showcase demonstrating three distinct patterns using LangChain.js and OpenAI GPT-4
          </p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="chat">Conversational AI</TabsTrigger>
            <TabsTrigger value="recipe">Recipe Generator</TabsTrigger>
            <TabsTrigger value="simple">Simple Query</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <ConversationalAI />
          </TabsContent>

          <TabsContent value="recipe">
            <RecipeGenerator />
          </TabsContent>

          <TabsContent value="simple">
            <SimpleQuery />
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built with React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, and LangChain.js</p>
        </footer>
      </div>
    </div>
  )
}

export default App

# LangChain Dashboard

An AI integration showcase demonstrating three distinct patterns using LangChain.js and OpenAI's GPT-4:

## Features

### Three Integration Patterns

1. **Conversational AI with Memory** - Chat interface with context retention using BufferMemory
2. **Template-Driven Prompt Engineering** - Recipe generator using structured PromptTemplate
3. **Direct LLM Queries** - Simple AI query interface with direct OpenAI calls

## Tech Stack

- **React 19** - Latest React with improved performance
- **Vite** - Fast build tool and dev server
- **TypeScript 5.x** - Type-safe development
- **Tailwind CSS 4.x** - Utility-first CSS with OKLCH color system
- **shadcn/ui** - Beautiful, accessible UI components
- **LangChain.js** - AI orchestration framework
- **OpenAI GPT-4** - Large language model
- **pnpm** - Fast, efficient package manager

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/louverture-t/lang_ai.git
   cd lang_ai
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
4. Add your OpenAI API key to `.env`:
   ```
   VITE_OPENAI_API_KEY=your_actual_api_key_here
   ```

### Development

Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### Building for Production

Build the static site:
```bash
pnpm build
```

Preview the production build:
```bash
pnpm preview
```

## Deployment

This project is configured for static hosting and can be deployed to:

- **GitHub Pages** - Set base path in `vite.config.ts`
- **Netlify** - Drag & drop the `dist` folder or connect your repo
- **Vercel** - Import your repository and deploy

### Environment Variables for Deployment

Make sure to set `VITE_OPENAI_API_KEY` in your hosting platform's environment variables.

⚠️ **Security Note**: The OpenAI API key is exposed in the client bundle. For production, consider:
- Using a backend proxy to secure your API key
- Implementing rate limiting
- Setting usage limits on your OpenAI account

## Project Structure

```
lang_ai/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── ConversationalAI.tsx
│   │   ├── RecipeGenerator.tsx
│   │   └── SimpleQuery.tsx
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main application
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles with Tailwind
├── public/                  # Static assets
└── ...config files
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

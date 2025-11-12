# LangChain Dashboard

**An AI integration showcase demonstrating three distinct patterns using LangChain.js and OpenAI's GPT-4.1-mini**

A production-ready React dashboard showcasing three different AI integration patterns with LangChain.js, TypeScript, and modern web technologies.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?logo=vite)
![LangChain](https://img.shields.io/badge/LangChain.js-1.0.4-00B2FF)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Three AI Integration Patterns

1. **🤖 Conversational AI with Memory**
   - Chat interface with conversation history
   - Uses `BufferMemory` to maintain context across messages
   - Implements `ConversationChain` for coherent multi-turn dialogues
   - Limit: 10 messages in memory for optimal performance

2. **👨‍🍳 Template-Driven Prompt Engineering**
   - Recipe generator with structured prompts
   - Uses `PromptTemplate` for consistent, parameterized prompts
   - Local storage persistence for saved recipes
   - Form validation and preset examples

3. **💬 Direct LLM Queries**
   - Simple Q&A without conversation memory
   - Direct `ChatOpenAI.invoke()` for stateless queries
   - React Query caching for improved performance
   - English-only responses enforced

### Modern Tech Stack

- **Frontend**: React 19, TypeScript 5.x, Vite 7.x
- **Styling**: Tailwind CSS 4.x with OKLCH color space, shadcn/ui components
- **AI**: LangChain.js 1.0.4, OpenAI GPT-4.1-mini
- **State**: React Query 5.x for server state, React Context for theme
- **Routing**: Wouter 3.x for lightweight client-side routing
- **Monitoring**: LangSmith integration for AI request tracing

### Production-Ready Features

- ✅ **Dual theme system** (light/dark) with smooth transitions
- ✅ **Responsive design** for mobile, tablet, and desktop
- ✅ **Error boundaries** with graceful fallbacks
- ✅ **Toast notifications** for user feedback
- ✅ **API key management** with localStorage persistence
- ✅ **Loading states** and skeleton UI
- ✅ **Code splitting** for optimized bundle sizes
- ✅ **TypeScript** with strict mode enabled
- ✅ **Accessibility** WCAG 2.1 AA compliant

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **pnpm** 8.x (recommended) or npm/yarn
- **OpenAI API key** ([Get one here](https://platform.openai.com/api-keys))
- **LangSmith API key** (optional, for tracing) ([Get one here](https://smith.langchain.com))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/louverture-t/lang_ai.git
cd lang_ai
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
```

3. **Set up environment variables**

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your actual API keys:

```env
# Required: OpenAI API Key
VITE_OPENAI_API_KEY=sk-proj-...

# Optional: LangSmith Tracing (for debugging)
VITE_LANGSMITH_API_KEY=lsv2_pt_...
VITE_LANGSMITH_PROJECT=langchain-dashboard
VITE_LANGSMITH_TRACING=true
```

4. **Start the development server**

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Usage

### First-Time Setup

1. The application will prompt you to enter your OpenAI API key on first visit
2. Your API key is stored securely in browser localStorage
3. You can change your API key anytime via the "Change" button in the header

### Using the AI Components

#### Conversational AI
- Type messages in the chat input
- Click example prompts for quick starts
- Conversation history is maintained for up to 10 messages
- Clear button resets the conversation

#### Recipe Generator
- Fill in cuisine, dish name, tone, and number of steps
- Click "Generate Recipe" to create AI-powered recipes
- Save recipes to localStorage for later reference
- Load preset examples for inspiration

#### Simple AI Query
- Ask any question in the input field
- Each query is independent (no memory)
- Clear button removes the current response
- Fast responses with React Query caching

## 🛠️ Development

### Project Structure

```
lang_ai/
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
├── public/               # Static assets
├── src/
│   ├── components/       # React components (flat structure)
│   │   ├── ui/          # shadcn/ui components
│   │   ├── AIChat.tsx
│   │   ├── RecipeGenerator.tsx
│   │   ├── SimpleAIQuery.tsx
│   │   └── ...
│   ├── contexts/         # React contexts (theme)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   ├── pages/            # Route pages (NotFound)
│   ├── App.tsx           # Main dashboard
│   ├── AppRouter.tsx     # Routing configuration
│   └── main.tsx          # Application entry point
├── .env.example          # Environment variables template
├── netlify.toml          # Netlify deployment config
├── vercel.json           # Vercel deployment config
└── vite.config.ts        # Vite configuration
```

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server (http://localhost:5173)
pnpm build            # Build for production
pnpm preview          # Preview production build locally

# Code Quality
pnpm lint             # Run ESLint
pnpm tsc --noEmit     # Type checking
```

### Architecture Decisions

- **Flat folder structure**: Minimizes nesting for better maintainability
- **No barrel exports**: Prevents circular dependencies
- **Single-page app**: No pages/ folder needed (uses App.tsx as main dashboard)
- **Direct imports**: Explicit imports instead of index.ts barrels
- **OKLCH colors**: Perceptually uniform color space for better gradients

## 🚢 Deployment

This project supports deployment to multiple platforms. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy Options

- **GitHub Pages**: Automated via GitHub Actions on push to main
- **Netlify**: One-click deploy or continuous deployment
- **Vercel**: Import from GitHub with zero configuration

## 🔒 Security

### Environment Variables

- ✅ `.env` is gitignored - never commit API keys
- ✅ `.env.example` provided as template
- ✅ `VITE_` prefix exposes variables to browser (by design)
- ⚠️ **Client-side keys are visible** - use API proxies for production

### Best Practices

- Rotate API keys regularly
- Use rate limiting on API endpoints
- Implement API key proxies for production deployments
- Never commit sensitive data to version control

## 📊 Monitoring & Debugging

### LangSmith Integration

LangSmith provides comprehensive tracing for all AI requests:

1. Sign up at [smith.langchain.com](https://smith.langchain.com)
2. Add your API key to `.env`
3. View traces in LangSmith dashboard:
   - Request/response payloads
   - Latency metrics
   - Token usage
   - Error logs

### React Query DevTools

Development mode includes React Query DevTools for inspecting:
- Query cache
- Mutation states
- Refetch behavior
- Loading states

## 🧪 Testing

### Manual Testing Checklist

- [ ] All 3 AI components work with valid API key
- [ ] Theme switching (no visual glitches)
- [ ] Responsive design (320px, 768px, 1024px+)
- [ ] API key modal appears on first visit
- [ ] localStorage persistence (theme, API key, recipes)
- [ ] LangSmith tracing captures requests (if enabled)
- [ ] React Query caching works correctly
- [ ] Error handling displays properly
- [ ] Loading states show correctly
- [ ] Production build works (`pnpm build && pnpm preview`)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LangChain.js](https://js.langchain.com/) - AI application framework
- [OpenAI](https://openai.com/) - GPT models
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/louverture-t/lang_ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/louverture-t/lang_ai/discussions)
- **Documentation**: [LangChain.js Docs](https://js.langchain.com/docs)

---

**Built with ❤️ using React, LangChain.js, and modern web technologies**

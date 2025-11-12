# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LangChain Dashboard** - An AI integration showcase demonstrating three distinct patterns using LangChain.js and OpenAI's GPT-4.1-mini:
1. Conversational AI with memory (chat interface)
2. Template-driven prompt engineering (recipe generator)
3. Direct LLM queries (simple AI query)

**Tech Stack**: React 19, Vite, TypeScript 5.x, Tailwind CSS 4.x (OKLCH), shadcn/ui, LangChain.js, pnpm

**Deployment Target**: Static hosting (GitHub Pages, Netlify, Vercel)

## Task Management with Taskmaster

This project uses **Taskmaster AI** for task-driven development. All development work should follow the Taskmaster workflow:

### Core Workflow Commands

```bash
# View tasks
task-master list                              # Show all tasks with status
task-master next                              # Get next available task
task-master show <id>                        # View specific task details (e.g., 1.2 for subtask)

# Work on tasks
task-master set-status --id=<id> --status=in-progress   # Start task
task-master update-subtask --id=<id> --prompt="notes"   # Log implementation progress
task-master set-status --id=<id> --status=done          # Complete task

# Task management
task-master expand --id=<id> --research --force         # Break down complex task
task-master update --from=<id> --prompt="changes"       # Update multiple future tasks
task-master add-dependency --id=<id> --depends-on=<id>  # Add task dependency
```

### MCP Integration

Taskmaster is available via MCP server (configured in [.mcp.json](.mcp.json)). Use MCP tools for programmatic access:
- `get_tasks`, `next_task`, `get_task`, `set_task_status`
- `expand_task`, `update_subtask`, `update_task`
- Full documentation: [.github/instructions/taskmaster.instructions.md](.github/instructions/taskmaster.instructions.md)

### Development Workflow

1. **Start session**: `task-master next` to find next task
2. **Review details**: `task-master show <id>` for implementation requirements
3. **Log plan**: `task-master update-subtask --id=<id> --prompt="detailed implementation plan"` before coding
4. **Implement**: Write code following logged plan
5. **Log progress**: Regularly update subtask with findings, what worked/didn't work
6. **Complete**: `task-master set-status --id=<id> --status=done` after verification

**Important**: Before implementing any feature, check the corresponding task in `.taskmaster/tasks/tasks.json` for detailed requirements and test strategy.

## Build/Lint/Test Commands

```bash
# Package management
pnpm install                    # Install dependencies

# Development
pnpm dev                        # Start dev server (http://localhost:5173)
pnpm build                      # Production build for deployment
pnpm preview                    # Preview production build locally

# Code quality
pnpm typecheck                  # Run TypeScript type checking (if configured)
```

## Architecture & Key Patterns

### Project Structure (Flat, Minimal Nesting)
```
src/
├── components/          # Shared components (flat structure)
│   ├── ui/             # shadcn/ui components only (auto-generated)
│   ├── AIChat.tsx
│   ├── RecipeGenerator.tsx
│   ├── SimpleAIQuery.tsx
│   └── ThemeToggle.tsx
├── contexts/           # React contexts
│   └── ThemeContext.tsx
├── hooks/              # Custom hooks
│   ├── useAIQuery.ts
│   ├── useAIChat.ts
│   └── useRecipeGenerator.ts
├── lib/                # Utilities (flat - no deep nesting)
│   ├── utils.ts        # General utilities
│   ├── chatConfig.ts   # LangChain configuration
│   ├── queryClient.ts  # React Query setup
│   └── templates.ts    # Prompt templates
├── App.tsx             # Main dashboard (single-page app)
├── main.tsx            # Entry point
└── index.css           # Global styles with OKLCH variables
```

**Best Practices:**
- ✅ **Flat structure** - Minimize nesting (max 2-3 levels)
- ✅ **No pages/ folder** - Single-page dashboard app
- ✅ **No barrel exports** - Direct imports prevent circular dependencies
- ✅ **Colocation** - Related files stay together

### Theme System
- **Dual themes**: Pastel green (light) and dark green (dark)
- **Color space**: OKLCH for perceptual uniformity
- **Implementation**: ThemeContext with localStorage persistence
- **Tailwind config**: Custom OKLCH variables in [tailwind.config.js](tailwind.config.js)

**Key OKLCH colors**:
- Light background: `oklch(0.97 0.02 145)`
- Dark background: `oklch(0.15 0.04 145)`

### LangChain Integration Patterns

1. **Conversational Memory** (AI Chat component)
   - Uses `BufferMemory` for conversation history
   - `ConversationChain` with `ChatOpenAI`
   - LangSmith tracing for debugging

2. **Template-Driven Prompts** (Recipe Generator)
   - `PromptTemplate` with structured inputs
   - React Query v5 for state management
   - Local storage for recipe persistence

3. **Direct LLM Calls** (Simple AI Query)
   - Direct `ChatOpenAI` invocation
   - Minimal abstraction for basic queries
   - React Query hooks for caching

### State Management
- **React Query v5**: AI response state, caching, optimistic updates
- **LocalStorage**: Theme preference, saved recipes
- **React Context**: Theme provider for app-wide theme state

## Code Style Guidelines

### TypeScript
- Strict mode enabled
- Path aliases: `@/` maps to `src/`
- Type all function parameters and returns
- Use interfaces for component props

### React 19 Patterns
- Functional components with hooks
- No class components
- Use React.memo() for performance optimization
- Proper dependency arrays in useEffect/useMemo

### Tailwind CSS
- Use OKLCH colors via CSS variables: `bg-background`, `text-foreground`
- Responsive modifiers: `md:`, `lg:` for mobile-first design
- Component composition: Extend shadcn/ui components, don't override

### Component Structure
```tsx
// imports
// types/interfaces
// main component function
// hooks and state
// event handlers
// effects
// render logic
// exports
```

## API Key Management & Environment Setup

### Environment Files
```
.env.example    # Template (committed) - shows required variables
.env            # Local secrets (gitignored) - your actual API keys
```

### Required Environment Variables
```bash
# .env.example (template)
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_LANGSMITH_API_KEY=your_langsmith_key_here
VITE_LANGSMITH_PROJECT=langchain-dashboard
VITE_LANGSMITH_TRACING=true
```

### Setup Instructions
1. Copy `.env.example` to `.env`
2. Add your actual API keys to `.env`
3. **Restart Vite dev server** after adding keys (environment variables require restart)
4. Get keys from:
   - OpenAI: https://platform.openai.com/api-keys
   - LangSmith (optional): https://smith.langchain.com

### API Key Priority System
The app uses a **priority-based** API key system implemented in `useApiKey` hook:

1. **Environment Variable** (`.env` file) - **Highest priority**
   - Reads from `VITE_OPENAI_API_KEY`
   - Requires dev server restart to take effect
   - Best for development

2. **localStorage** (user-entered via modal) - **Fallback**
   - Saved when user enters key through UI
   - Persists across sessions
   - Best for deployment

3. **Modal Prompt** - **Last resort**
   - Shows if no key found in either location
   - Allows users to enter key manually

### Implementation Details

**useApiKey Hook** ([src/hooks/useApiKey.ts](src/hooks/useApiKey.ts)):
```typescript
const envKey = import.meta.env.VITE_OPENAI_API_KEY;
const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);

if (envKey && typeof envKey === 'string' && envKey.trim()) {
  setApiKey(envKey);  // Environment variable takes precedence
} else if (storedKey) {
  setApiKey(storedKey);  // Fall back to localStorage
} else {
  setShowModal(true);  // Show modal if neither exists
}
```

**LangChain Configuration** ([src/lib/chatConfig.ts](src/lib/chatConfig.ts)):
```typescript
// IMPORTANT: Use 'apiKey' parameter (primary), not 'openAIApiKey' (alias)
return new ChatOpenAI({
  apiKey: apiKey,  // Primary parameter in LangChain v1.1.0+
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  // ...
});
```

### Troubleshooting API Key Issues

**Error**: `Missing credentials. Please pass an 'apiKey'`

**Solutions**:
1. **Verify `.env` file exists** with `VITE_OPENAI_API_KEY=sk-...`
2. **Restart dev server** after adding/changing `.env` (Ctrl+C then `pnpm dev`)
3. **Hard refresh browser** (Ctrl+Shift+R or Cmd+Shift+R) to clear cache
4. **Check console logs** for debug messages:
   - `🔑 API Key Debug: { envKeyExists: true, ... }`
   - `✅ Using environment variable API key`
5. **Verify API key format** starts with `sk-` and is >20 characters
6. **Check parameter name** in LangChain config is `apiKey` (not `openAIApiKey`)

### Security Best Practices
- ✅ `.env` is in `.gitignore` - never commit secrets
- ✅ `.env.example` shows structure without sensitive data
- ✅ `VITE_` prefix exposes variables to browser (by design)
- ⚠️ **Client-side keys are visible** - use API proxies for production
- ⚠️ Never commit API keys to git
- ⚠️ Rotate keys immediately if accidentally exposed
- ⚠️ Restart dev server after `.env` changes

## Taskmaster Configuration

- **Tasks database**: [.taskmaster/tasks/tasks.json](.taskmaster/tasks/tasks.json)
- **AI models config**: [.taskmaster/config.json](.taskmaster/config.json) (managed via `task-master models`)
- **API keys**: Set in `.env` for CLI or `.vscode/mcp.json` for MCP integration
- **PRD document**: [.taskmaster/docs/LangChain-Dashboard-PRD.txt](.taskmaster/docs/LangChain-Dashboard-PRD.txt)

**Do not manually edit** `tasks.json` - use Taskmaster commands instead.

## Deployment

**Target**: GitHub Pages (or any static host)

**Vite config requirements**:
- Set correct `base` path for GitHub Pages (usually `/<repo-name>/`)
- Optimize build for production
- Configure asset paths correctly

**Build output**: `dist/` directory (git-ignored)

## Key References

- **Taskmaster workflow**: [.github/instructions/dev_workflow.instructions.md](.github/instructions/dev_workflow.instructions.md)
- **Taskmaster commands**: [.github/instructions/taskmaster.instructions.md](.github/instructions/taskmaster.instructions.md)
- **Rule guidelines**: [.github/instructions/vscode_rules.instructions.md](.github/instructions/vscode_rules.instructions.md)
- **Product requirements**: [.taskmaster/docs/LangChain-Dashboard-PRD.txt](.taskmaster/docs/LangChain-Dashboard-PRD.txt)
- **Project summary**: [TASKMASTER_WORKFLOW_SUMMARY.md](TASKMASTER_WORKFLOW_SUMMARY.md)

## Important Notes

1. **Always check tasks first**: Before implementing any feature, check `.taskmaster/tasks/tasks.json` for requirements
2. **Log implementation details**: Use `task-master update-subtask` to document findings during development
3. **Follow dependency order**: Respect task dependencies - complete prerequisites before starting dependent tasks
4. **React 19 compatibility**: Ensure clean console output, no deprecation warnings
5. **Theme switching**: Test all components in both light and dark themes
6. **Responsive design**: Verify mobile (320px+), tablet (768px+), and desktop (1024px+) layouts
7. **Error handling**: All AI operations must have proper error states and user feedback

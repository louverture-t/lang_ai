Implementation Plan: LangChain Dashboard Project
Created: November 11, 2025 Status: Ready for Execution Estimated Timeline: 15-21 days

Overview
Implement all 10 tasks and 42 subtasks from the Taskmaster tasks.json file in dependency order, building a React 19 + LangChain.js AI dashboard with 3 integration patterns.

Current Status
Completed: Task 1 (3/5 subtasks), Task 2 (0/3 subtasks - marked done but not implemented)
Pending: 39 subtasks across 10 tasks
Next Action: Complete remaining Task 1 subtasks, then properly implement Task 2
Execution Plan (6 Phases)
Phase 1: Complete Foundation (Tasks 1-2)
Estimated Time: 1-2 days Dependencies: None (foundational work)

1. Task 1.4: Configure TypeScript & folder structure
task-master set-status --id=1.4 --status=in-progress
Create folder structure:
src/components/ - React components
src/components/ui/ - shadcn/ui components
src/contexts/ - React contexts (ThemeContext)
src/hooks/ - Custom hooks
src/lib/ - Utilities (LangChain config, API helpers)
src/pages/ - Page components
Configure tsconfig.json:
Enable strict mode
Add path alias: "@/*": ["./src/*"]
Configure React 19 JSX transform
Create index.ts barrel exports in each folder
Test: Verify TypeScript compilation passes, absolute imports work
task-master update-subtask --id=1.4 --prompt="[Log implementation details here]"
task-master set-status --id=1.4 --status=done
2. Task 1.5: Configure Vite for GitHub Pages
task-master set-status --id=1.5 --status=in-progress
Update vite.config.ts:
export default defineConfig({
  base: '/lang_ai/', // GitHub Pages base path
  // ... other config
})
Create .gitignore (if not exists):
node_modules/
dist/
.env
.DS_Store
Initialize git: git init (if needed)
Test: Run pnpm build to verify production build works
task-master update-subtask --id=1.5 --prompt="[Log Vite config changes]"
task-master set-status --id=1.5 --status=done
3. Task 2.1: Install shadcn/ui CLI and Lucide React
task-master set-status --id=2.1 --status=in-progress
Install shadcn/ui: pnpm dlx shadcn@latest init
Configure components.json:
TypeScript: yes
Style: CSS variables
Base color: neutral
Global CSS: src/index.css
Components: src/components/ui
Utils: src/lib/utils
Install Lucide React: pnpm add lucide-react
Test: Verify CLI works, components.json created
task-master update-subtask --id=2.1 --prompt="[Log CLI setup details]"
task-master set-status --id=2.1 --status=done
4. Task 2.2: Add required shadcn/ui components
task-master set-status --id=2.2 --status=in-progress
Install components:
pnpm dlx shadcn@latest add button card dialog input label scroll-area textarea toast
Verify Radix UI dependencies installed
Import test: Verify each component can be imported
Test: Create simple test file importing all components
task-master update-subtask --id=2.2 --prompt="[Log component installation]"
task-master set-status --id=2.2 --status=done
5. Task 2.3: Customize styles for OKLCH theme
task-master set-status --id=2.3 --status=in-progress
Update CSS variables in src/index.css to support OKLCH
Ensure focus indicators meet WCAG AA standards
Test keyboard navigation on all components
Verify components work in both light/dark modes
Test: Tab through all components, verify accessibility
task-master update-subtask --id=2.3 --prompt="[Log theme customization details]"
task-master set-status --id=2.3 --status=done
Phase 2: Core Features (Tasks 3-4)
Estimated Time: 2-3 days Dependencies: Task 2 complete

6. Task 3: Implement theme system (4 subtasks)
task-master show 3  # Review full requirements
task-master set-status --id=3.1 --status=in-progress
3.1: Create ThemeContext.tsx

Location: src/contexts/ThemeContext.tsx
Create context with type: 'light' | 'dark'
Implement provider with state management
Export useTheme hook
3.2: Define OKLCH CSS variables

Add to src/index.css:
:root {
  --background: oklch(0.97 0.02 145);
  --foreground: oklch(0.25 0.04 145);
  /* ... all light theme variables */
}

.dark {
  --background: oklch(0.15 0.04 145);
  --foreground: oklch(0.92 0.02 145);
  /* ... all dark theme variables */
}
3.3: Configure Tailwind for custom colors

Update tailwind.config.js:
theme: {
  extend: {
    colors: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      // ... other custom colors
    }
  }
}
3.4: Implement localStorage & theme toggle

localStorage key: 'theme-preference'
Add smooth transition: 200ms ease-in-out
Create theme toggle button component
Test: Theme persists on reload, all colors update
# Mark each subtask done as completed
task-master set-status --id=3.1 --status=done
task-master set-status --id=3.2 --status=done
task-master set-status --id=3.3 --status=done
task-master set-status --id=3.4 --status=done
7. Task 4: Build API key configuration modal (3 subtasks)
task-master show 4
task-master set-status --id=4.1 --status=in-progress
4.1: Create ApiKeyModal component

Use shadcn Dialog component
Password-masked input field
Save/Cancel buttons
4.2: Implement validation & localStorage

localStorage key: 'openai-api-key'
Validate API key format (starts with sk-)
Show error states for invalid keys
4.3: Auto-display logic & security warnings

Check localStorage on mount
Show modal if no key exists
Add warning text about client-side key exposure
Test: Modal appears on first visit, doesn't show after key saved
task-master set-status --id=4.1 --status=done
task-master set-status --id=4.2 --status=done
task-master set-status --id=4.3 --status=done
Phase 3: LangChain Integration (Task 5)
Estimated Time: 3-4 days Dependencies: Task 4 complete

8. Task 5: Set up LangChain.js ecosystem (7 subtasks)
task-master show 5
task-master set-status --id=5.1 --status=in-progress
5.1: Install LangChain packages

pnpm add @langchain/openai @langchain/core langsmith @tanstack/react-query
5.2: Configure LangSmith tracing

Create environment variable setup
Add to .env.example:
VITE_OPENAI_API_KEY=your_key_here
VITE_LANGSMITH_API_KEY=your_key_here
VITE_LANGSMITH_PROJECT=langchain-dashboard
Configure tracing in app initialization
5.3: Set up React Query providers

Create src/lib/queryClient.ts:
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 } // 5 minutes
  }
});
Wrap app with QueryClientProvider
5.4: Create ChatOpenAI configuration

Create src/lib/langchain/chatConfig.ts:
import { ChatOpenAI } from '@langchain/openai';

export const createChatModel = (apiKey: string) => {
  return new ChatOpenAI({
    modelName: 'gpt-4.1-mini',
    temperature: 0.7,
    openAIApiKey: apiKey,
  });
};
5.5: Implement PromptTemplate helpers

Create src/lib/langchain/templates.ts
Define templates for recipe generation
Add template formatting utilities
5.6: Implement error handling with React Query

Create error handling utilities
Define mutation error callbacks
Add retry logic for failed requests
5.7: Create reusable utility hooks

src/hooks/useAIQuery.ts - Simple queries
src/hooks/useAIChat.ts - Conversational memory
src/hooks/useRecipeGenerator.ts - Template-driven prompts
Test: Each hook works independently
# Mark each subtask done
task-master set-status --id=5.1 --status=done
# ... through 5.7
task-master set-status --id=5.7 --status=done
Phase 4: AI Components (Tasks 6-8) - Can be parallelized
Estimated Time: 4-5 days Dependencies: Task 5 complete

9. Task 6: AI Chat component (4 subtasks)
task-master show 6
6.1: Create chat component structure

src/components/AIChat.tsx
Define message interface: { role: 'user' | 'assistant', content: string }
Set up component state
6.2: Implement message display

Scrollable container (max-height: 500px)
Message bubbles with proper styling
Text wrapping with break-words
Auto-scroll to bottom on new messages
6.3: Add conversation memory

Use BufferMemory from LangChain
Limit to 10 messages
Integrate with React Query mutation
Persist state during session
6.4: Add loading states & examples

Show loading indicator during API calls
Add example prompts: ["Tell me a joke", "Explain React hooks", "What is AI?"]
Test: Memory works, messages display correctly
task-master set-status --id=6.1 --status=done
# ... through 6.4
10. Task 7: Recipe Generator (4 subtasks)
task-master show 7
7.1: Create form component

Inputs: tone (select), cuisine (text), dish (text), steps (number)
Use shadcn form components
Add validation
7.2: Implement PromptTemplate integration

Create recipe prompt template
Format inputs into structured prompt
Call ChatOpenAI with template
7.3: Create recipe display with localStorage

Scrollable card (max-height: 400px)
Save button to store recipes
localStorage key: 'saved-recipes'
List saved recipes
7.4: Add example buttons

Examples: ["Italian pasta", "Chinese stir-fry", "American BBQ"]
Pre-fill form on click
Test: Recipe generation, saving, retrieval
task-master set-status --id=7.1 --status=done
# ... through 7.4
11. Task 8: Simple AI Query (3 subtasks)
task-master show 8
8.1: Create simple query component

src/components/SimpleAIQuery.tsx
Input field and submit button
Result display area (max-height: 400px)
8.2: Implement direct ChatOpenAI integration

Use ChatOpenAI.invoke() directly
No memory - independent queries
English-only responses
React Query for caching
8.3: Add example buttons & loading states

Examples: ["What is the capital of France?", "Explain quantum physics", "Tell me a fun fact"]
Loading spinner during API calls
Error states
Test: Independent queries, caching works
task-master set-status --id=8.1 --status=done
# ... through 8.3
Phase 5: Dashboard Integration (Task 9)
Estimated Time: 2-3 days Dependencies: Tasks 6, 7, 8 complete

12. Task 9: Main dashboard layout (4 subtasks)
task-master show 9
9.1: Implement responsive grid layout

src/App.tsx or src/pages/Dashboard.tsx
Desktop (1024px+): 3-column grid
Tablet (768px-1023px): 2-column grid
Mobile (320px-767px): 1-column stack
Max-width: 1280px
Padding: 1rem (mobile) → 1.5rem (tablet) → 2rem (desktop)
9.2: Create header with theme toggle

App title: "LangChain Dashboard"
Theme toggle button with sun/moon icons
Responsive header layout
9.3: Integrate AI components

Place AIChat, RecipeGenerator, SimpleAIQuery in grid
Ensure QueryClientProvider wraps components
Verify all components communicate with API
9.4: Add error boundary & loading states

React Error Boundary component
Global loading state
Toast notifications for errors
Test: Responsive breakpoints, all components functional
task-master set-status --id=9.1 --status=done
# ... through 9.4
Phase 6: Deployment & Testing (Task 10)
Estimated Time: 3-4 days Dependencies: Task 9 complete

13. Task 10: Finalize deployment (6 subtasks)
task-master show 10
10.1: Install Wouter routing

pnpm add wouter@3.x
Set up basic routing (if needed for future features)
Configure base path for GitHub Pages
10.2: Create GitHub Actions workflow

File: .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
10.3: Configure Vite for GitHub Pages

Verify base path in vite.config.ts
Test local production build: pnpm build && pnpm preview
10.4: Implement error boundary & toasts

Global error boundary component
Toast notifications using shadcn toast
Error logging to console (with LangSmith tracing)
10.5: Create comprehensive documentation

Update README.md:
Project description
Features list (3 AI patterns)
Tech stack
Setup instructions
Environment variables needed
Deployment instructions
Screenshots/demo link
Add code comments
Document component props
10.6: End-to-end testing

Test checklist:
✅ All 3 AI components work
✅ Theme switching (no visual glitches)
✅ Responsive design (320px, 768px, 1024px+)
✅ API key modal appears on first visit
✅ localStorage persistence (theme, API key, recipes)
✅ LangSmith tracing captures all requests
✅ React Query caching works
✅ Error handling displays properly
✅ Loading states show correctly
✅ Production build works
✅ Deployment to GitHub Pages succeeds
task-master set-status --id=10.1 --status=done
# ... through 10.6
Taskmaster Workflow Commands
Starting a Task
task-master next                                    # Find next available task
task-master show <id>                              # Review task requirements
task-master set-status --id=<id> --status=in-progress
During Implementation
# Log implementation details as you work
task-master update-subtask --id=<id> --prompt="Detailed notes about implementation choices, what worked, what didn't work, code snippets, decisions made"
Completing a Task
# Test according to testStrategy
pnpm build  # Verify no errors
pnpm dev    # Test functionality

# Mark complete
task-master set-status --id=<id> --status=done
If Requirements Change
# Update future tasks based on new learnings
task-master update --from=<id> --prompt="Explanation of changes needed"
Key Success Criteria
Technical Requirements
✅ All 42 subtasks marked "done" in Taskmaster ✅ Clean React 19 console (no warnings or errors) ✅ TypeScript compilation passes with no errors ✅ Both themes (light/dark) working perfectly ✅ All 3 AI patterns functional with proper error handling

User Experience
✅ Responsive design works on mobile (320px+), tablet (768px+), desktop (1024px+) ✅ Theme switching has no visual glitches or content reflow ✅ Loading states provide clear feedback ✅ Error messages are user-friendly ✅ Text wrapping prevents overflow in all components

Integration & Deployment
✅ LangSmith tracing operational and capturing all AI requests ✅ React Query caching optimized (5-minute stale time) ✅ localStorage persists theme, API key, and saved recipes ✅ Successfully deployed to GitHub Pages ✅ GitHub Actions workflow runs without errors

Code Quality
✅ All components properly typed with TypeScript ✅ Code follows React 19 best practices ✅ Tailwind CSS classes used consistently ✅ shadcn/ui components not modified (only composed) ✅ Comprehensive README.md documentation

Estimated Timeline
Phase	Tasks	Subtasks	Estimated Time
1. Foundation	1-2	8	1-2 days
2. Core Features	3-4	7	2-3 days
3. LangChain Setup	5	7	3-4 days
4. AI Components	6-8	11	4-5 days
5. Dashboard	9	4	2-3 days
6. Deployment	10	6	3-4 days
TOTAL	10	42	15-21 days
Important Notes
Follow Taskmaster workflow: Always use task-master commands to track progress
Log implementation details: Use update-subtask frequently to document learnings
Test incrementally: Verify each subtask works before moving to next
Respect dependencies: Don't start a task until all dependencies are complete
Update CLAUDE.md: Document any new patterns or architectural decisions
Commit frequently: Commit after each completed task/subtask with descriptive messages
Next Steps to Begin
When ready to start implementation:

# 1. Review next task
task-master next

# 2. Start with Task 1.4
task-master show 1.4
task-master set-status --id=1.4 --status=in-progress

# 3. Create folder structure and configure TypeScript
# ... implement ...

# 4. Log progress
task-master update-subtask --id=1.4 --prompt="Created folder structure: components/, components/ui/, contexts/, hooks/, lib/, pages/. Configured tsconfig.json with strict mode and path alias @/ -> src/. Verified absolute imports work correctly."

# 5. Mark complete
task-master set-status --id=1.4 --status=done

# 6. Continue with 1.5, then 2.1, 2.2, 2.3, etc.
Plan Status: ✅ Ready for Execution Last Updated: November 11, 2025 Total Estimated Effort: 15-21 days (42 subtasks)
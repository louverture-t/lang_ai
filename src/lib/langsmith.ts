/**
 * LangSmith Tracing Configuration
 *
 * Sets up LangSmith for tracing and debugging LangChain operations.
 * LangSmith provides observability into LLM calls, chains, and agents.
 *
 * Environment Variables:
 * - VITE_LANGSMITH_API_KEY: Your LangSmith API key (optional)
 * - VITE_LANGSMITH_TRACING: Enable/disable tracing (optional, default: false)
 * - VITE_LANGSMITH_PROJECT: Project name for organizing traces (optional)
 */

/**
 * Initialize LangSmith tracing if configured
 *
 * Call this function at app startup to enable LangSmith tracing.
 * If environment variables are not set, tracing will be silently disabled.
 */
export function initializeLangSmith(): void {
  const apiKey = import.meta.env.VITE_LANGSMITH_API_KEY;
  const tracingEnabled = import.meta.env.VITE_LANGSMITH_TRACING === 'true';
  const project = import.meta.env.VITE_LANGSMITH_PROJECT || 'langchain-dashboard';

  if (tracingEnabled && apiKey) {
    // Set environment variables for LangSmith
    // These are read by LangChain internally
    if (typeof process !== 'undefined') {
      process.env.LANGCHAIN_TRACING_V2 = 'true';
      process.env.LANGCHAIN_API_KEY = apiKey;
      process.env.LANGCHAIN_PROJECT = project;
    }

    console.log(`✓ LangSmith tracing enabled for project: ${project}`);
  } else if (tracingEnabled && !apiKey) {
    console.warn('⚠️ LangSmith tracing is enabled but VITE_LANGSMITH_API_KEY is not set');
  }
}

/**
 * Get LangSmith configuration status
 *
 * @returns Object with tracing configuration details
 */
export function getLangSmithStatus() {
  return {
    enabled: import.meta.env.VITE_LANGSMITH_TRACING === 'true',
    hasApiKey: !!import.meta.env.VITE_LANGSMITH_API_KEY,
    project: import.meta.env.VITE_LANGSMITH_PROJECT || 'langchain-dashboard',
  };
}

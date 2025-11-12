import { useState, useEffect } from 'react';

const API_KEY_STORAGE_KEY = 'openai-api-key';

interface UseApiKeyReturn {
  apiKey: string | null;
  hasApiKey: boolean;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  saveApiKey: (key: string) => void;
  clearApiKey: () => void;
}

/**
 * Custom hook to manage OpenAI API key state with environment variable and localStorage support
 *
 * Features:
 * - Checks VITE_OPENAI_API_KEY environment variable first (highest priority)
 * - Falls back to localStorage if no environment variable is set
 * - Shows modal on first visit if no key exists in either location
 * - Persists key to localStorage when saved through UI
 * - Provides methods to save/clear API key
 *
 * Priority order:
 * 1. Environment variable (VITE_OPENAI_API_KEY in .env)
 * 2. localStorage (user-entered key through modal)
 * 3. Modal prompt (if neither is available)
 */
export function useApiKey(): UseApiKeyReturn {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check environment variables and localStorage on mount
  useEffect(() => {
    // First, try to get key from environment variables
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;

    // Then check localStorage
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);

    // DEBUG: Log what we found
    console.log('🔑 API Key Debug:', {
      envKeyExists: !!envKey,
      envKeyType: typeof envKey,
      envKeyLength: envKey?.length || 0,
      envKeyPrefix: envKey?.substring(0, 7) || 'none',
      storedKeyExists: !!storedKey,
      storedKeyPrefix: storedKey?.substring(0, 7) || 'none',
    });

    if (envKey && typeof envKey === 'string' && envKey.trim()) {
      // Environment variable takes precedence
      console.log('✅ Using environment variable API key');
      setApiKey(envKey);
    } else if (storedKey) {
      // Fall back to localStorage
      console.log('✅ Using localStorage API key');
      setApiKey(storedKey);
    } else {
      // No key found - show modal on first visit
      console.log('❌ No API key found - showing modal');
      setShowModal(true);
    }

    setIsInitialized(true);
  }, []);

  const saveApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
  };

  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey(null);
    setShowModal(true);
  };

  return {
    apiKey,
    hasApiKey: !!apiKey,
    showModal: showModal && isInitialized,
    setShowModal,
    saveApiKey,
    clearApiKey,
  };
}

# Environment Comparison: Local vs GitHub Pages

## Visual Flow Comparison

### 🏠 Local Development (`pnpm dev`)

```
┌─────────────────────────────────────────────────────────────┐
│                    LOCAL ENVIRONMENT                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. .env file exists in project root                        │
│     ┌──────────────────────────────────┐                    │
│     │ VITE_OPENAI_API_KEY=sk-proj-... │                    │
│     └──────────────────────────────────┘                    │
│                    ↓                                         │
│  2. Vite reads .env at build time                           │
│     (when you run `pnpm dev`)                               │
│                    ↓                                         │
│  3. Environment variable injected                           │
│     import.meta.env.VITE_OPENAI_API_KEY = "sk-proj-..."    │
│                    ↓                                         │
│  4. useApiKey hook checks:                                  │
│     ✅ envKey found!                                        │
│                    ↓                                         │
│  5. API key available                                       │
│     ❌ NO MODAL SHOWN                                       │
│                    ↓                                         │
│  6. ✅ App works immediately                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 🌐 GitHub Pages Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                  GITHUB PAGES ENVIRONMENT                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. .env file NOT in repository                             │
│     (gitignored for security)                               │
│                    ↓                                         │
│  2. GitHub Actions builds project                           │
│     `pnpm build` (no .env available)                        │
│                    ↓                                         │
│  3. Environment variable NOT injected                       │
│     import.meta.env.VITE_OPENAI_API_KEY = undefined        │
│                    ↓                                         │
│  4. useApiKey hook checks:                                  │
│     ❌ envKey = undefined                                   │
│     ❌ localStorage empty (first visit)                     │
│                    ↓                                         │
│  5. No API key available                                    │
│     ✅ MODAL SHOWN                                          │
│                    ↓                                         │
│  6. User enters API key                                     │
│     ┌──────────────────────────────────┐                    │
│     │  [Enter your OpenAI API key]    │                    │
│     │  sk-proj-...                     │                    │
│     │         [Save Key]               │                    │
│     └──────────────────────────────────┘                    │
│                    ↓                                         │
│  7. Key saved to localStorage                               │
│     localStorage.setItem('openai-api-key', 'sk-proj-...')  │
│                    ↓                                         │
│  8. ✅ App works with user's key                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Code Flow Comparison

### Local Development

```typescript
// useApiKey.ts - Priority System

useEffect(() => {
  // 1. Check environment variable
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  //    ↓
  //    "sk-proj-abc123..." ✅ FOUND
  
  // 2. Check localStorage (skipped - env key found)
  const storedKey = localStorage.getItem('openai-api-key');
  
  if (envKey && typeof envKey === 'string' && envKey.trim()) {
    console.log('✅ Using environment variable API key');
    setApiKey(envKey); // ← API key set!
  }
  // Modal NOT shown
}, []);
```

### GitHub Pages

```typescript
// useApiKey.ts - Priority System

useEffect(() => {
  // 1. Check environment variable
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  //    ↓
  //    undefined ❌ NOT FOUND
  
  // 2. Check localStorage
  const storedKey = localStorage.getItem('openai-api-key');
  //    ↓
  //    null ❌ NOT FOUND (first visit)
  
  if (envKey && typeof envKey === 'string' && envKey.trim()) {
    // Skipped - envKey is undefined
  } else if (storedKey) {
    // Skipped - storedKey is null
  } else {
    console.log('❌ No API key found - showing modal');
    setShowModal(true); // ← Modal shown!
  }
}, []);
```

---

## File Presence Comparison

### Local Development

```
your-project/
├── .env                    ✅ EXISTS (gitignored)
│   └── VITE_OPENAI_API_KEY=sk-proj-...
├── .env.example            ✅ EXISTS (committed)
├── src/
├── dist/                   ← Built files (after `pnpm build`)
└── ...
```

### GitHub Repository

```
your-repo/
├── .env                    ❌ NOT COMMITTED (gitignored)
├── .env.example            ✅ COMMITTED (template)
├── src/
└── ...
```

### GitHub Actions Build

```
GitHub Actions Runner:
├── .env                    ❌ DOES NOT EXIST
├── .env.example            ✅ EXISTS (but not used)
├── src/
├── dist/                   ← Built files (deployed to GitHub Pages)
│   └── assets/
│       └── index-xyz.js    ← import.meta.env.VITE_OPENAI_API_KEY = undefined
└── ...
```

---

## Browser Console Logs

### Local Development Console

```javascript
// When you open http://localhost:5173

🔑 API Key Debug: {
  envKeyExists: true,          ✅
  envKeyType: "string",
  envKeyLength: 51,
  envKeyPrefix: "sk-proj",
  storedKeyExists: false,
  storedKeyPrefix: "none"
}
✅ Using environment variable API key
🤖 createChatModel called: {
  hasApiKey: true,
  apiKeyType: "string",
  apiKeyLength: 51,
  apiKeyPrefix: "sk-proj",
  isValid: true
}
✅ Creating ChatOpenAI instance with valid key
```

### GitHub Pages Console (First Visit)

```javascript
// When you open https://yourusername.github.io/lang_ai/

🔑 API Key Debug: {
  envKeyExists: false,         ❌
  envKeyType: "undefined",
  envKeyLength: 0,
  envKeyPrefix: "none",
  storedKeyExists: false,      ❌
  storedKeyPrefix: "none"
}
❌ No API key found - showing modal

// After user enters key and saves:

🔑 API Key Debug: {
  envKeyExists: false,
  envKeyType: "undefined",
  envKeyLength: 0,
  envKeyPrefix: "none",
  storedKeyExists: true,       ✅
  storedKeyPrefix: "sk-proj"
}
✅ Using localStorage API key
🤖 createChatModel called: {
  hasApiKey: true,
  apiKeyType: "string",
  apiKeyLength: 51,
  apiKeyPrefix: "sk-proj",
  isValid: true
}
✅ Creating ChatOpenAI instance with valid key
```

---

## Network Requests

### Both Environments (After API Key is Available)

```
Request to OpenAI API:
POST https://api.openai.com/v1/chat/completions

Headers:
  Authorization: Bearer sk-proj-...
  Content-Type: application/json

Body:
  {
    "model": "gpt-4o-mini",
    "messages": [...],
    "temperature": 0.7,
    "max_tokens": 1000
  }

Response:
  {
    "choices": [
      {
        "message": {
          "role": "assistant",
          "content": "..."
        }
      }
    ]
  }
```

**Note**: The API request is identical in both environments once an API key is available!

---

## localStorage State

### Local Development

```javascript
// localStorage is typically empty (env var used instead)
localStorage.getItem('openai-api-key')
// → null

// Unless you manually entered a key through the modal
```

### GitHub Pages

```javascript
// After user enters key in modal:
localStorage.getItem('openai-api-key')
// → "sk-proj-abc123..."

// Persists across page refreshes and browser sessions
// (until user clears browser data or clicks "Change" button)
```

---

## Summary Table

| Aspect | Local Dev | GitHub Pages |
|--------|-----------|--------------|
| `.env` file | ✅ Exists | ❌ Gitignored |
| `VITE_OPENAI_API_KEY` | ✅ Injected by Vite | ❌ Undefined |
| API Key Source | Environment Variable | User Input → localStorage |
| Modal Shown | ❌ No | ✅ Yes (first visit) |
| Who Pays | You (your API key) | User (their API key) |
| Security | ⚠️ Key in source | ✅ User's own key |
| Setup Required | Create `.env` file | User enters key in modal |

---

## Key Takeaway

The difference is **intentional and by design**:

- **Local Development**: You use your own API key for testing
- **GitHub Pages**: Each user provides their own API key for security

This is the **correct and secure** approach for static site deployment! 🎉


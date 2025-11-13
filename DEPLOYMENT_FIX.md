# GitHub Pages Deployment - API Key Configuration Fix

## Problem Summary

**Local Development (✅ Works)**
- `.env` file contains `VITE_OPENAI_API_KEY=sk-...`
- Vite injects environment variables at build time
- App accesses key via `import.meta.env.VITE_OPENAI_API_KEY`

**GitHub Pages (❌ Fails)**
- `.env` is gitignored (correctly, for security)
- GitHub Actions builds without environment variables
- `import.meta.env.VITE_OPENAI_API_KEY` is `undefined`
- Error: "Missing credentials. Please pass an `apiKey`, or set the `OPENAI_API_KEY` environment variable."

---

## Solution Options

### **Option 1: User-Provided API Keys (✅ RECOMMENDED for Public Demos)**

This is the **intended behavior** for your app! The modal that prompts users to enter their API key is designed for exactly this scenario.

#### How It Works:
1. User visits deployed site
2. Modal appears requesting API key
3. User enters their own OpenAI API key
4. Key is stored in `localStorage`
5. App works normally

#### Advantages:
- ✅ No secrets in repository
- ✅ Each user uses their own API key
- ✅ No API costs to you
- ✅ Secure and transparent
- ✅ No additional setup required

#### Current Implementation:
Your app already has this fully implemented via:
- `useApiKey` hook (`src/hooks/useApiKey.ts`)
- `ApiKeyConfig` modal component (`src/components/ApiKeyConfig.tsx`)
- Priority system: Environment Variable → localStorage → Modal prompt

**This option requires NO changes** - your deployment is working as designed!

---

### **Option 2: GitHub Actions Secrets (⚠️ NOT RECOMMENDED)**

You could add your API key as a GitHub repository secret and inject it during build.

#### Setup Steps:

1. **Add API Key to GitHub Secrets:**
   - Go to your repository on GitHub
   - Navigate to: `Settings` → `Secrets and variables` → `Actions`
   - Click `New repository secret`
   - Name: `VITE_OPENAI_API_KEY`
   - Value: Your OpenAI API key (e.g., `sk-proj-...`)
   - Click `Add secret`

2. **Update GitHub Actions Workflow:**

Edit `.github/workflows/deploy.yml`:

```yaml
- name: Build project
  run: pnpm build
  env:
    NODE_ENV: production
    VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}  # Add this line
```

#### ⚠️ **Critical Security Warnings:**

1. **API Key Exposure**: The key will be embedded in your built JavaScript files and visible to anyone who inspects the source code
2. **Public Access**: Anyone can use your API key by viewing the page source
3. **Cost Risk**: You'll pay for all API usage by all visitors
4. **Rate Limiting**: Your key may hit rate limits quickly with public access
5. **Security Risk**: Exposed keys can be extracted and used maliciously

**DO NOT USE THIS OPTION** unless you understand and accept these risks.

---

### **Option 3: Backend API Proxy (✅ RECOMMENDED for Production)**

For production apps with your own API key, use a backend proxy to hide the key.

#### Architecture:
```
User → Your Backend API → OpenAI API
     (no key visible)    (key stored securely)
```

#### Implementation Options:

**A. Netlify/Vercel Serverless Functions:**

Create `netlify/functions/chat.ts` or `vercel/api/chat.ts`:

```typescript
import { ChatOpenAI } from '@langchain/openai';

export default async function handler(req, res) {
  // API key stored in environment variables (server-side only)
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { message, history } = req.body;
    
    const model = new ChatOpenAI({
      apiKey: apiKey,
      modelName: 'gpt-4o-mini',
    });

    const response = await model.invoke(message);
    
    res.json({ response: response.content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
}
```

**B. Update Frontend to Use Proxy:**

Modify `src/lib/chatConfig.ts` to detect environment and use proxy:

```typescript
export async function sendChatMessage(message: string, history: any[]) {
  // Check if we should use backend proxy
  const useProxy = import.meta.env.VITE_USE_API_PROXY === 'true';
  
  if (useProxy) {
    // Call your backend proxy
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    
    return await response.json();
  } else {
    // Use client-side API key (development or user-provided)
    const apiKey = getUserApiKey(); // From localStorage or env
    const model = createChatModel(apiKey);
    return await model.invoke(message);
  }
}
```

#### Advantages:
- ✅ API key never exposed to client
- ✅ Full control over usage and costs
- ✅ Can implement rate limiting, authentication, etc.
- ✅ Production-ready security

---

## Recommended Approach

### For Your Current Use Case (Demo/Portfolio):

**Use Option 1** (User-Provided API Keys) - **No changes needed!**

Your app is already correctly configured. The modal prompt is the intended behavior for GitHub Pages deployment.

### To Improve User Experience:

Add a banner to explain the API key requirement:

**Update `src/App.tsx` or create a banner component:**

```tsx
{!apiKey && (
  <div className="bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800 p-4">
    <div className="max-w-7xl mx-auto text-center">
      <p className="text-sm text-blue-900 dark:text-blue-100">
        <strong>Welcome!</strong> This demo requires your own OpenAI API key.
        Get one free at{' '}
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-700"
        >
          platform.openai.com
        </a>
        {' '}(new users get $5 free credit)
      </p>
    </div>
  </div>
)}
```

### For Production Deployment:

**Use Option 3** (Backend API Proxy) for security and cost control.

---

## Testing Your Deployment

1. **Visit your GitHub Pages site** (currently showing the modal)
2. **Enter your OpenAI API key** in the modal
3. **Test the chat functionality** - it should work!
4. **Refresh the page** - key should persist in localStorage

The modal is **not an error** - it's the correct behavior for a static site deployment without server-side secrets.

---

## Additional Notes

### Why Local Development Works:

When you run `pnpm dev`:
1. Vite reads your local `.env` file
2. Injects `VITE_OPENAI_API_KEY` into `import.meta.env`
3. `useApiKey` hook finds the environment variable
4. No modal appears because key is available

### Why GitHub Pages Shows Modal:

When GitHub Actions builds:
1. No `.env` file exists (gitignored)
2. No environment variables injected (unless you add secrets)
3. `import.meta.env.VITE_OPENAI_API_KEY` is `undefined`
4. `useApiKey` hook falls back to localStorage
5. Modal appears to collect user's API key

**This is by design and is the secure approach for static sites!**

---

## Summary

✅ **Your app is working correctly!** The modal on GitHub Pages is the intended behavior.

✅ **No changes needed** unless you want to add a welcome banner for better UX.

⚠️ **Do NOT add your API key to GitHub secrets** unless you understand the security implications.

✅ **For production**, implement a backend proxy to hide your API key.


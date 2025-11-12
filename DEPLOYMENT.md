# Deployment Guide

This guide covers deploying the LangChain Dashboard to three popular hosting platforms: **GitHub Pages**, **Netlify**, and **Vercel**.

## Table of Contents

- [Prerequisites](#prerequisites)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Project builds successfully (`pnpm build`)
- ✅ No TypeScript errors (`pnpm tsc --noEmit`)
- ✅ Environment variables configured (see [Environment Variables](#environment-variables))
- ✅ Git repository pushed to GitHub

---

## GitHub Pages Deployment

GitHub Pages provides free static hosting with automatic HTTPS.

### Automatic Deployment (Recommended)

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the `main` branch.

#### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions** (NOT "Deploy from a branch")
4. Save the settings

#### 2. Update Base Path

The base path is already configured in [vite.config.ts](vite.config.ts#L18):

```typescript
base: process.env.NODE_ENV === 'production' ? '/lang_ai/' : '/',
```

**Important**: If your repository name is different from `lang_ai`, update this line to match your repository name:

```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

#### 3. Push to Main Branch

```bash
git add .
git commit -m "feat: configure deployment"
git push origin main
```

#### 4. Monitor Deployment

1. Go to **Actions** tab in your GitHub repository
2. Watch the "Deploy to GitHub Pages" workflow
3. Once complete (usually 1-2 minutes), your site will be live at:
   ```
   https://yourusername.github.io/lang_ai/
   ```

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
pnpm build

# The dist/ folder contains your built files
# You can deploy this folder manually to GitHub Pages
```

### Troubleshooting GitHub Pages

**Problem**: 404 errors on deployed site

**Solution**: Verify the `base` path in `vite.config.ts` matches your repository name exactly.

**Problem**: Workflow fails with "Permission denied"

**Solution**: Go to **Settings** → **Actions** → **General** → **Workflow permissions** and enable "Read and write permissions"

---

## Netlify Deployment

Netlify offers automatic deployments, preview deploys for PRs, and serverless functions.

### Method 1: Continuous Deployment (Recommended)

#### 1. Import from GitHub

1. Sign up at [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Netlify will auto-detect Vite configuration

#### 2. Configure Build Settings

Netlify should auto-detect these settings from [netlify.toml](netlify.toml):

- **Build command**: `pnpm build`
- **Publish directory**: `dist`
- **Node version**: 20

If not detected, manually configure:

```
Build command:       pnpm build
Publish directory:   dist
```

#### 3. Add Environment Variables

In Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add your variables:
   ```
   VITE_OPENAI_API_KEY=your_key_here
   VITE_LANGSMITH_API_KEY=your_langsmith_key (optional)
   VITE_LANGSMITH_PROJECT=langchain-dashboard
   VITE_LANGSMITH_TRACING=true
   ```

#### 4. Deploy

Click **"Deploy site"** and Netlify will build and deploy your application.

Your site will be live at: `https://your-site-name.netlify.app`

### Method 2: Manual Deployment via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
pnpm build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Method 3: GitHub Actions (Automated)

The project includes a Netlify deployment workflow. To use it:

1. Get your Netlify credentials:
   - Go to Netlify → **User settings** → **Applications**
   - Generate a new **Personal access token**
   - Get your **Site ID** from **Site settings** → **General**

2. Add GitHub Secrets:
   - Go to your repo → **Settings** → **Secrets and variables** → **Actions**
   - Add `NETLIFY_AUTH_TOKEN` (your personal access token)
   - Add `NETLIFY_SITE_ID` (your site ID)

3. Push to trigger workflow:
   ```bash
   git push origin main
   ```

### Netlify Features

- **Preview Deploys**: Automatic preview URLs for pull requests
- **Custom Domains**: Free HTTPS with custom domains
- **Redirects**: SPA routing configured in `netlify.toml`
- **Headers**: Security headers pre-configured

---

## Vercel Deployment

Vercel provides zero-configuration deployments optimized for frontend frameworks.

### Method 1: Import from GitHub (Recommended)

#### 1. Import Project

1. Sign up at [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel auto-detects Vite configuration

#### 2. Configure Project

Vercel should auto-detect these settings from [vercel.json](vercel.json):

- **Framework**: Vite
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`

#### 3. Add Environment Variables

In Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add for **Production**, **Preview**, and **Development**:
   ```
   VITE_OPENAI_API_KEY=your_key_here
   VITE_LANGSMITH_API_KEY=your_langsmith_key (optional)
   VITE_LANGSMITH_PROJECT=langchain-dashboard
   VITE_LANGSMITH_TRACING=true
   ```

#### 4. Deploy

Click **"Deploy"** and Vercel will build and deploy your application.

Your site will be live at: `https://your-project.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel --prod
```

### Vercel Features

- **Preview Deployments**: Unique URLs for every git push
- **Edge Network**: Global CDN for fast loading
- **Analytics**: Built-in performance monitoring
- **Custom Domains**: Free HTTPS with custom domains

---

## Environment Variables

### Required Variables

```env
# OpenAI API Key (Required)
VITE_OPENAI_API_KEY=sk-proj-...
```

### Optional Variables

```env
# LangSmith Tracing (Optional - for AI request monitoring)
VITE_LANGSMITH_API_KEY=lsv2_pt_...
VITE_LANGSMITH_PROJECT=langchain-dashboard
VITE_LANGSMITH_TRACING=true
```

### Security Notes

⚠️ **Important Security Considerations:**

1. **Client-side exposure**: Variables with `VITE_` prefix are exposed to the browser
2. **Never commit secrets**: `.env` is gitignored, only commit `.env.example`
3. **Production keys**: Consider using API proxies for production to hide keys
4. **Key rotation**: Regularly rotate API keys for security

### Setting Up API Proxies (Production)

For production deployments, consider proxying API calls through a backend:

```
Client → Your Backend API → OpenAI API
```

This hides your API keys from the client-side code.

Example serverless function (Netlify/Vercel):

```typescript
// netlify/functions/openai-proxy.ts or vercel/api/openai-proxy.ts
export default async function handler(req, res) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Server-side only
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.json(data);
}
```

---

## Troubleshooting

### Common Issues

#### Build Fails with TypeScript Errors

**Problem**: Build fails with TypeScript compilation errors

**Solution**:
```bash
# Check for type errors
pnpm tsc --noEmit

# Fix errors and rebuild
pnpm build
```

#### 404 on Refresh (SPA Routing)

**Problem**: Page refreshes result in 404 errors

**Solution**: Ensure your hosting platform has SPA redirects configured:
- **GitHub Pages**: Handled by Wouter base path
- **Netlify**: Configured in `netlify.toml` (`[[redirects]]`)
- **Vercel**: Configured in `vercel.json` (`rewrites`)

#### Environment Variables Not Working

**Problem**: API calls fail in production

**Solution**:
1. Verify variables are prefixed with `VITE_`
2. Check hosting platform has variables configured
3. Rebuild and redeploy after adding variables
4. Clear browser cache

#### Large Bundle Size

**Problem**: Slow initial load due to large bundle

**Solution**: Code splitting is already configured in `vite.config.ts`:
```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'langchain': ['@langchain/openai', '@langchain/core', 'langchain'],
  'query': ['@tanstack/react-query'],
}
```

#### CORS Errors

**Problem**: CORS errors when calling OpenAI API

**Solution**:
- OpenAI API allows CORS from browser origins
- If using a proxy, ensure CORS headers are set correctly
- Check browser console for specific CORS error messages

---

## Platform Comparison

| Feature | GitHub Pages | Netlify | Vercel |
|---------|-------------|---------|--------|
| **Cost** | Free | Free tier | Free tier |
| **Build Time** | ~1-2 min | ~40-60s | ~30-50s |
| **CDN** | ✅ Yes | ✅ Yes | ✅ Yes (Edge) |
| **Custom Domains** | ✅ Free HTTPS | ✅ Free HTTPS | ✅ Free HTTPS |
| **Preview Deploys** | ❌ No | ✅ Yes | ✅ Yes |
| **Serverless Functions** | ❌ No | ✅ Yes | ✅ Yes |
| **Build Minutes/Month** | Unlimited | 300 | 6000 |
| **Best For** | Simple static sites | Full-stack apps | Frontend frameworks |

---

## Recommended Workflow

1. **Development**: Use `pnpm dev` for local development
2. **Testing**: Build locally with `pnpm build && pnpm preview`
3. **Staging**: Use Netlify/Vercel preview deploys for testing
4. **Production**: Deploy to main branch for automatic deployment

---

## Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [LangChain.js Deployment](https://js.langchain.com/docs/deployment)

---

**Need help?** Open an issue on [GitHub](https://github.com/louverture-t/lang_ai/issues)

# API Key Troubleshooting Guide

## 🔴 **CRITICAL: AI Not Responding After Deployment?**

If your AI components aren't responding on GitHub Pages, follow this systematic troubleshooting guide.

---

## **Step 1: Verify Your API Key is Valid**

### Check OpenAI Dashboard
1. Go to https://platform.openai.com/api-keys
2. Verify your API key exists and is active
3. **IMPORTANT**: Check you have credits available at https://platform.openai.com/usage

### Common API Key Issues
- ❌ **Expired trial credits** - Most common issue!
- ❌ **API key revoked or deleted**
- ❌ **Wrong API key format** (must start with `sk-`)
- ❌ **Billing issue** - No payment method or card declined

---

## **Step 2: Check Browser Console for Errors**

### How to Open Developer Console
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
- **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
- **Safari**: `Cmd+Option+C` (Mac)

### Look For These Errors

#### ✅ **CORS Errors** (Most Common)
```
Access to fetch at 'https://api.openai.com/...' from origin 'https://louverture-t.github.io' 
has been blocked by CORS policy
```

**Solution**: OpenAI API should allow CORS from browsers. If you see this:
1. Check if you're using a VPN or firewall that blocks OpenAI
2. Try disabling browser extensions temporarily
3. Check network tab to see the actual HTTP status code

#### ✅ **401 Unauthorized**
```
Error: 401 - Invalid API key
```

**Solutions**:
- Your API key is wrong or expired
- Re-enter your API key in the app
- Generate a new key at https://platform.openai.com/api-keys

#### ✅ **429 Rate Limit**
```
Error: 429 - Rate limit exceeded
```

**Solutions**:
- You've made too many requests
- Wait 1 minute and try again
- Check your OpenAI rate limits

#### ✅ **402 Payment Required**
```
Error: 402 - Insufficient credits
```

**Solutions**:
- Add credits to your OpenAI account
- Add a payment method at https://platform.openai.com/settings/billing

---

## **Step 3: Test API Key Manually**

### Use Browser Console to Test
1. Open your deployed site: https://louverture-t.github.io/lang_ai/
2. Open browser console (`F12`)
3. Paste this code (replace `YOUR_API_KEY` with your actual key):

```javascript
fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Say "Hello"' }],
    max_tokens: 10
  })
})
.then(r => r.json())
.then(d => console.log('✅ SUCCESS:', d))
.catch(e => console.error('❌ ERROR:', e));
```

### Interpret Results
- ✅ **Success**: You see a response with text "Hello" → API key works!
- ❌ **401 Error**: Invalid API key
- ❌ **402 Error**: No credits/billing issue
- ❌ **429 Error**: Rate limit exceeded
- ❌ **CORS Error**: Network/browser configuration issue

---

## **Step 4: Clear Browser Storage**

Sometimes old/corrupted data causes issues:

### Clear localStorage
1. Open browser console (`F12`)
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Find "Local Storage" → Click your domain
4. Right-click → "Clear All"
5. Refresh the page

### Or Use Console
```javascript
localStorage.clear();
location.reload();
```

---

## **Step 5: Re-enter API Key**

1. Click the "API Key Set" or "Configure" button in the app header
2. Delete the old key
3. Enter your API key carefully (copy-paste to avoid typos)
4. Ensure no extra spaces before/after the key
5. Click "Save Key"

---

## **Step 6: Check Network Tab**

### View API Requests
1. Open Developer Tools (`F12`)
2. Go to "Network" tab
3. Try sending a message in the app
4. Look for requests to `api.openai.com`
5. Click on the request to see:
   - Request headers (is API key sent?)
   - Response status (200 = success, 401 = unauthorized, etc.)
   - Response body (what error message?)

---

## **Common Issues & Solutions**

### Issue: "API Key Not Configured"
**Symptoms**: Modal keeps appearing even after entering key
**Solution**:
- Check browser console for errors
- Try clearing localStorage and re-entering key
- Verify key format: must start with `sk-` and be 40+ characters

### Issue: "Request Timed Out"
**Symptoms**: Loading forever, no response
**Solution**:
- Check your internet connection
- Try a different network (could be firewall blocking OpenAI)
- Check OpenAI status: https://status.openai.com

### Issue: "Model Error"
**Symptoms**: Error about GPT-4 model
**Solution**:
- Your API key might not have access to GPT-4
- The app uses `gpt-4o-mini` which should work with all keys
- Check your OpenAI account tier

### Issue: Works Locally But Not on GitHub Pages
**Symptoms**: Perfect on `localhost`, broken on deployed site
**Possible Causes**:
1. **Different API key**: You might be using environment variable locally but localStorage in production
2. **CORS issue**: Unlikely but possible - check browser console
3. **HTTPS requirement**: OpenAI requires HTTPS (GitHub Pages has this, so not usually the issue)

---

## **Security Warning**

⚠️ **IMPORTANT**: Your API key is stored in browser localStorage and visible in DevTools. This is fine for:
- Personal projects
- Learning/development
- Low-stakes applications

For production applications, you should:
1. Create a backend proxy server
2. Store API key on server (not client)
3. Have client call your backend, which calls OpenAI
4. Implement rate limiting and authentication

---

## **Still Having Issues?**

### Enable Debug Mode
The latest version includes enhanced debugging. Look for:
- Debug info panel when errors occur
- Detailed error messages with troubleshooting hints
- Request/response logging in browser console

### Check These:
1. ✅ OpenAI account has credits
2. ✅ API key is valid and active
3. ✅ Browser console shows no CORS errors
4. ✅ Network tab shows 200 status codes
5. ✅ localStorage has the API key stored
6. ✅ No firewall/VPN blocking OpenAI domains

### Report Issue on GitHub
If nothing works, open an issue at:
https://github.com/louverture-t/lang_ai/issues

Include:
- Browser and version
- Screenshot of browser console errors
- Screenshot of Network tab
- Whether it works locally or not

---

## **Quick Fixes Checklist**

- [ ] Verified API key at platform.openai.com
- [ ] Checked credits/billing at platform.openai.com/usage
- [ ] Opened browser console (F12) and checked for errors
- [ ] Tested API key with manual fetch request
- [ ] Cleared localStorage and re-entered API key
- [ ] Tried on different browser/network
- [ ] Checked OpenAI status page
- [ ] Read error messages carefully in the app

---

## **For Developers: Production Setup**

If you're deploying this for real users, don't use client-side API keys. Set up a backend:

### Option 1: Vercel Serverless Function
```typescript
// api/chat.ts
export default async function handler(req, res) {
  const { message } = req.body;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }],
    }),
  });
  
  const data = await response.json();
  res.json(data);
}
```

### Option 2: Express.js Backend
```javascript
// server.js
const express = require('express');
const app = express();

app.post('/api/chat', async (req, res) => {
  // Same logic as above
});

app.listen(3000);
```

Then update your frontend to call your backend instead of OpenAI directly.

---

**Last Updated**: November 12, 2025

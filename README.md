# FridgeChef (Gemini edition)

This is your original no-code export, modified to use the Gemini API directly
instead of the base44 platform's `InvokeLLM` / `UploadFile`.

## What changed from the original
- Removed `base44Client` and all `base44.integrations.Core.*` calls.
- Removed the base44 `AuthProvider` / `useAuth` / `UserNotRegisteredError` logic
  (the app is now fully open, no login). Add your own auth later if needed.
- Replaced the custom `<Image>` component with plain `<img>` tags.
- Added `server.js` — a small Express backend that calls the Gemini API and
  keeps your API key safely on the server, never exposed to the browser.
- Added `vite.config.js` proxy so frontend `/api/...` calls reach the backend.
- Fixed a typo (`ref__` → `ref`) in `UploadArea.jsx`.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and add your Gemini API key
   (get one free at https://aistudio.google.com/apikey):
   ```bash
   cp .env.example .env
   ```
3. Run both the frontend and backend together:
   ```bash
   npm run dev:all
   ```
   Or run them separately in two terminals:
   ```bash
   npm run server   # backend on http://localhost:3001
   npm run dev       # frontend on http://localhost:5173
   ```
4. Open the frontend URL Vite prints (usually http://localhost:5173).

## Notes
- `.env` is git-ignored — never commit your real API key.
- This project has no database. Ingredient/recipe data is passed between
  pages via React Router navigation state, so refreshing a page or opening
  a link directly (e.g. `/recipes`) without going through the flow will
  redirect you back to the home page.
- `src/lib/PageNotFound.jsx` and `src/components/ScrollToTop.jsx` are
  referenced in `App.jsx` but weren't part of the original files you shared —
  if you don't already have them, create simple versions, e.g.:

  ```jsx
  // src/lib/PageNotFound.jsx
  export default function PageNotFound() {
    return <div className="text-center py-24">Page not found.</div>;
  }
  ```

  ```jsx
  // src/components/ScrollToTop.jsx
  import { useEffect } from 'react';
  import { useLocation } from 'react-router-dom';
  export default function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => window.scrollTo(0, 0), [pathname]);
    return null;
  }
  ```

## Deploying later
When you're ready to host this (Vercel, Netlify, etc.), `server.js`'s logic
can be moved into a serverless function (e.g. `/api/invoke-llm.js` on
Vercel) with minimal changes — the Gemini fetch call itself stays the same.

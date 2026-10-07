# Stockly frontend

Stockly's responsive research desk is built with React, TypeScript, and Vite. It includes public landing, features, and workflow pages, plus the existing dashboard, authentication, research history, charts, and memo view.

## Routes

- `/` — public landing page
- `/features` — feature overview
- `/how-it-works` — research workflow
- `/dashboard` — company search, market data, charts, reports, and saved history
- `/login` and `/register` — authentication

## Local development

Start the backend on port `5000`, then run:

```bash
npm install
npm run dev
```

The Vite development server proxies `/api` requests to `http://localhost:5000` so local browser requests avoid CORS errors. If the backend uses another address, set `VITE_DEV_API_TARGET` in `.env.local`.

## Type checking and production build

```bash
npx tsc --noEmit
npm run build
```

The report view renders memo headings and lists, separates metadata into cards, and cleans common escaped LaTeX price-path notation for readability.

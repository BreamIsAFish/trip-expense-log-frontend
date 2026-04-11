# Trip Expense Log (frontend)

LINE LIFF + React client for the trip expense tracker. It talks to the Go backend under `/api`.

## Prerequisites

- Node.js 20+
- A LINE Developers LIFF app (`VITE_LIFF_ID`)
- Backend running with matching CORS and auth (see repo root)

## Setup

```bash
cp .env.example .env.local
```

Set `VITE_LIFF_ID` and, if needed, `VITE_API_URL` (must include the `/api` suffix, e.g. `http://localhost:8080/api`). If you omit `VITE_API_URL`, the app uses `{origin}/api`, which matches the Vite dev proxy and the bundled `nginx.conf` `/api` reverse proxy.

## Scripts

```bash
npm install
npm run dev      # Vite on http://localhost:5173 — proxies /api → localhost:8080
npm run build
npm run preview
```

## Docker

Build args `VITE_API_URL` and `VITE_LIFF_ID` are baked in at compile time. For the provided `nginx.conf`, leaving `VITE_API_URL` unset (so the client calls same-origin `/api`) is often simplest; override when the API is on another origin.

## TypeScript

This project pins TypeScript **5.7.3** (not 6.x).

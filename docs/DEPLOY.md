# Deploy MVP

This MVP has two deployable pieces:

1. `apps/web` — Vite React guest/host UI
2. `apps/api` — tiny Node API with JSON-backed request storage

## Recommended quick deployment

Use:

- **Vercel** for the web app
- **Railway** or **Render** for the API

## Important production caveat

The API currently stores requests in `data/requests.json`. That is fine for a tiny demo, but not a durable real product.

Before real public usage, replace this with Postgres/SQLite + migrations. Railway Postgres is probably the quickest path.

## Local run

```bash
npm install
npm run dev:api
npm run dev:web
```

Open: `http://localhost:5173`.

## Deploy API to Railway

1. Create a Railway project from the GitHub repo.
2. Railway should detect `railway.json`.
3. Deploy from branch `mvp-foundation` or `main` after merge.
4. Confirm health:

```text
https://YOUR_API_DOMAIN/health
```

Expected:

```json
{ "ok": true }
```

## Deploy API to Render

1. Create a new Render Blueprint or Web Service.
2. Use `render.yaml`, or configure Docker manually:
   - Dockerfile path: `apps/api/Dockerfile`
   - Health path: `/health`
3. Confirm `/health` works.

## Deploy Web to Vercel

1. Import the GitHub repo into Vercel.
2. Use the root project; `vercel.json` points Vercel at `apps/web`.
3. Add env var:

```text
VITE_TEM_API_URL=https://YOUR_API_DOMAIN
```

4. Deploy.

## MVP public checklist

Before sending to real people:

- API is deployed and `/health` works
- Web is deployed and points to API via `VITE_TEM_API_URL`
- Create a test booking from guest page
- Confirm it appears in host dashboard
- Accept it from host dashboard
- Confirm guest calendar shows the slot as busy / bid-required
- Reset or clean `data/requests.json` if demo data should not be visible

## Next infra step

Move from JSON file to Postgres:

- `requests` table
- `slots` table
- host settings table
- payment intents table

Keep the HTTP API shape mostly stable so the frontend does not need a rewrite.

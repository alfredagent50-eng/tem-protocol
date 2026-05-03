# API

Tiny MVP API for shared guest + host state.

## Run locally

```bash
npm run dev:api
npm run dev:web
```

Default API: `http://localhost:8787`.

The web app reads `VITE_TEM_API_URL`; if unset it uses `http://localhost:8787`.

## Endpoints

### `GET /health`

Returns `{ "ok": true }`.

### `GET /requests`

Returns all booking requests from the JSON store.

### `POST /requests`

Creates a paid request in `host_review`.

Required body:

```json
{
  "slotId": "sun-1630",
  "typeId": "talk",
  "guestName": "Tal",
  "guestEmail": "tal@example.com",
  "note": "Short context",
  "amount": 500,
  "currency": "sats"
}
```

### `PATCH /requests/:id/status`

Updates host review state.

```json
{ "status": "accepted" }
```

Supported statuses for now: `accepted`, `rejected`, `host_review`.

Accepting one request rejects other pending requests for the same slot.

### `GET /market/slots`

Returns slots with derived market state:

- `marketStatus`: `open`, `requested`, or `busy`
- `nextBidFloor`: minimum amount needed to request/compete for that slot
- `acceptedRequestId`
- `highestPendingRequestId`

## Storage

For now this uses `data/requests.json` so state survives refreshes and is shared between guest/host views.

This is intentionally temporary. Next real backend step is replacing the JSON store with SQLite/Postgres while keeping the API contract stable.

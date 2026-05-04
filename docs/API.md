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

### `POST /payment-intents`

Creates a Stripe-like payment intent for MVP checkout wiring.

- If `STRIPE_SECRET_KEY` is unset, this uses the mock provider.
- If `STRIPE_SECRET_KEY` is set, this creates a real Stripe PaymentIntent with automatic payment methods enabled.

```json
{
  "amount": 9,
  "currency": "USD"
}
```

Returns:

```json
{
  "id": "pay-...",
  "provider": "mock | stripe | grow | payplus | tranzila | allpay",
  "status": "created | requires_payment_method | ...",
  "amount": 9,
  "currency": "USD",
  "clientSecret": "pi_..._secret_... when using Stripe",
  "applePayReady": true,
  "cardReady": true
}
```

### `POST /payment-intents/:id/simulate-paid`

Marks the mock payment as paid. Later this becomes Stripe webhook handling.

### `POST /requests`

Creates a mock-paid request in `host_review` for the current MVP.

Target real-payment lifecycle: create as `pending_payment`, attach a Stripe Checkout Session / PaymentIntent, then move to `host_review` only after a verified payment webhook.

Required body:

```json
{
  "slotId": "sun-1630",
  "typeId": "talk",
  "guestName": "Alex",
  "guestEmail": "alex@example.com",
  "note": "Short context",
  "amount": 9,
  "currency": "USD"
}
```

### `PATCH /requests/:id/status`

Updates host review state.

```json
{ "status": "accepted" }
```

Supported statuses for now: `accepted`, `rejected`, `host_review`.

Host status updates are protected by `TEM_HOST_TOKEN` when set; clients send it as `Authorization: Bearer <token>`.

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

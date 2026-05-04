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

Host-only. Requires `Authorization: Bearer <TEM_HOST_TOKEN>`.

Returns full booking requests, including guest PII, for the private host dashboard.

### `GET /public/requests`

Public redacted market feed for the guest page.

Does **not** expose `guestName`, `guestEmail`, or `note`.

### `GET /market/slots`

Public slot market state. Does not expose guest PII.

Returns slots with derived market state:

- `marketStatus`: `open`, `requested`, or `busy`
- `nextBidFloor`: minimum amount needed to request/compete for that slot
- `acceptedRequestId`
- `highestPendingRequestId`

### `POST /payment-intents`

Creates a provider-neutral payment intent/session.

Pricing is server-owned. The client sends only slot/type intent:

```json
{
  "slotId": "sun-1630",
  "typeId": "talk"
}
```

The API calculates `amount` and `currency` server-side.

Returns:

```json
{
  "id": "pay-...",
  "provider": "mock | stripe | grow | payplus | tranzila | allpay",
  "status": "created | requires_payment_method | ...",
  "amount": 7,
  "currency": "USD",
  "clientSecret": "pi_..._secret_... when using Stripe",
  "checkoutMode": "simulated | payment_element | redirect_placeholder"
}
```

### `POST /requests`

Creates a booking request as `pending_payment`.

Required body:

```json
{
  "slotId": "sun-1630",
  "typeId": "talk",
  "guestName": "Alex",
  "guestEmail": "alex@example.com",
  "note": "Short context",
  "paymentIntentId": "pay-..."
}
```

The API ignores client-supplied `amount`/`currency` and recalculates pricing server-side.

The `paymentIntentId` must have been created by `POST /payment-intents` for the exact same `slotId`, `typeId`, server-calculated `amount`, and `currency`; otherwise request creation fails with `payment_intent_quote_mismatch`.

### `POST /webhooks/payment-success`

Payment success webhook skeleton.

```json
{
  "paymentIntentId": "pay-...",
  "eventId": "evt_..."
}
```

Moves the matching request from `pending_payment`/`paid` to `host_review`.

Webhook handling is idempotent by `eventId`; duplicate events return `idempotent: true` and do not corrupt state.

Current mock UI calls this endpoint after simulated payment. This endpoint is mock-only unless a real provider signature verifier is implemented; non-mock provider intents are rejected with `verified_provider_webhook_required`.

### `POST /payment-intents/:id/simulate-paid`

Mock-only helper for local/demo checkout. Does not itself move requests into host review.

### `PATCH /requests/:id/status`

Host-only. Requires `Authorization: Bearer <TEM_HOST_TOKEN>`.

```json
{ "status": "accepted" }
```

Supported statuses: `pending_payment`, `paid`, `host_review`, `accepted`, `completed`, `rejected`, `expired`.

Accepting one request rejects other paid/review requests for the same slot.

## Storage

For now this uses `data/requests.json` so state survives refreshes and is shared between guest/host views.

This is intentionally temporary. Next real backend step is replacing the JSON store with SQLite/Postgres while keeping the API contract stable.

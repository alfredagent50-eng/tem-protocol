# Day 2 Handoff — CoffeeSip / tem-protocol

Date: 2026-05-04

## What shipped

### Domain + deployment

- Bought `coffeesip.app` via Namecheap.
- Connected apex + `www` to Vercel nameservers.
- Verified live HTTPS on `https://coffeesip.app`.
- Continued using:
  - Web: Vercel
  - API: Railway
  - Repo: GitHub `alfredagent50-eng/tem-protocol`

### Product direction

CoffeeSip is now the consumer-facing product direction.

Core language moved from individual to communal:

- Current headline: **“Our time’s worth a sip.”**
- Section language: **“What do we want?”**
- Request prompt: **“What should we make happen?”**

Important product clarification:

- This is not “friends paying friends to hang.”
- It is for valuing access/time/attention in weak-tie or third/fourth-circle contexts.
- “Hang” felt socially wrong with money, so it was replaced with **Meet**.

Current request types:

- Talk
- Favor
- Meet
- Show up
- Urgent

### Brand direction

Locked temporary brand lane: **S / sip / aroma**.

Notes:

- Minimal 2026 style.
- Cream/off-white canvas.
- Espresso black.
- Muted blue accent.
- Optional amber warmth.
- No crypto visuals.
- No busy startup moodboard.

Docs:

- `docs/COFFEESIP_BRAND_DIRECTION.md`

Generated visual reference on Bar’s Mac:

- `/Users/barkolen/Desktop/coffeesip-s-aroma-brand.jpg`

### Mobile UI

Major mobile work shipped:

- Fixed the iPhone “split/cut screen” layout bug.
- Made guest flow single-column and continuous.
- Cleaned public page prototype feel.
- Added clearer demo helper and receipt.
- Restored clean Guest/Host switch in the top bar.

Current top switch:

- Guest: ☕
- Host: 🔐

### Payments / safety

Decision: **do not enable live Stripe yet. Keep mock payments.**

Why:

- Stripe/Israel business support is unresolved.
- Codex review flagged P0 pre-live payment safety issues.

P0 safety fixes shipped:

- `GET /requests` is host-auth only.
- `GET /public/requests` exposes only redacted public request state.
- Public endpoints do not expose `guestName`, `guestEmail`, or `note`.
- API owns pricing; client sends only `slotId` + `typeId`.
- `POST /requests` creates `pending_payment`, not `host_review`.
- Requests attach `paymentIntentId`.
- Payment intents are stored/bound to exact slot/type/amount/currency quote.
- Request creation rejects mismatched paymentIntentId with `payment_intent_quote_mismatch`.
- `/webhooks/payment-success` moves requests to `host_review` only in mock mode unless real provider verification exists.
- Webhook idempotency added via `eventId`.
- Host PATCH status transitions are explicit; invalid transitions return 409.

Still not live-payment safe:

- No verified Stripe webhook signature handling yet.
- No Stripe.js / Payment Element UI yet.
- No selected legal/payment provider path yet: US entity + Stripe vs Israeli PSP vs temporary payment links.
- JSON file storage is still temporary and not production-safe.
- Host auth is still token-based MVP auth, not real accounts.

### Tool/runtime fix

Image/screenshot media failed because OpenClaw’s optional image dependency `sharp` was missing.

Fixed by installing global `sharp`; browser screenshot attachment worked afterward.

## Important commits from Day 2

- `d6eab50` Add P0 payment safety guards
- `07e9e50` Tighten mock payment safety
- `8bb9f91` Clarify demo booking flow
- `b8bd340` Apply CoffeeSip S aroma direction
- `30bb46c` Refine CoffeeSip brand and request types
- `e0f1d38` Show clean guest host switch

## Day 3 recommended plan

### Option A — Product demo polish (recommended)

Goal: make CoffeeSip feel like something people can understand in 30 seconds.

Tasks:

1. Add a clean “How it works” section or modal.
2. Improve host dashboard after entering token.
3. Add empty/demo states that feel intentional.
4. Add better copy for Meet / Show up / Urgent.
5. Make the full demo path feel natural:
   - choose task
   - choose time
   - fill demo
   - complete demo payment
   - receipt
   - host review

### Option B — Backend hardening

Goal: reduce technical debt before more product work.

Tasks:

1. Replace JSON storage with SQLite/Postgres.
2. Add migration/seed tooling.
3. Add real auth path for host.
4. Add admin cleanup endpoint/tool guarded by token.
5. Add proper payment-intent expiry.

### Recommendation

Start Day 3 with **Option A** for 60–90 minutes, then do one backend-hardening slice.

The product momentum is high; we should keep making the demo emotionally clear before sinking into infrastructure.

## Personal note

Bar is starting/attending a robotics course. Remember this for future product ideas — robotics + CoffeeSip/tem-protocol may become useful later.

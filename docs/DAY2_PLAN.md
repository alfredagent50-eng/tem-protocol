# Day 2 Plan — CoffeeSip / tem-protocol

Context: Bar has ~3.5 hours today, leaving around 17:00 Asia/Jerusalem.

## Product direction

Working consumer-facing name for today: **CoffeeSip**.

Underlying repo/protocol remains `tem-protocol`: Time Equals Money — paid access to someone's time, attention, or presence.

Payment principle: guests pay with the fastest normal payment flow — Apple Pay / card / local currency. Crypto should not appear in the guest checkout. Host-side settings can later convert incoming small payments into Bitcoin.

## Today’s highest-value sprint

### 1. Make the app safer to show

- Add simple host dashboard protection.
- Stop exposing host controls openly from the public page.
- Keep it lightweight: password/token gate is enough for MVP day two.

### 2. Define real payment flow without implementing full money movement yet

- Add payment architecture doc/update API contract.
- Model lifecycle:
  - request created as `payment_required` or `pending_payment`
  - payment provider creates checkout/payment intent
  - webhook marks request `paid_pending_host`
  - host accepts/passes
  - accepted request becomes committed
- Stripe is the most likely first provider because Apple Pay/card support is straightforward.
- Bitcoin conversion should be host-side phase two, not guest-facing MVP.

### 3. Domain shortlist and decision

Initial checks via RDAP suggest:

- `coffeesip.com` — registered
- `getcoffeesip.com` — likely available
- `coffeesip.money` — likely available
- `coffeesip.cash` — likely available
- `coffeesip.club` — likely available
- `coffeesip.link` — likely available
- `buymeasip.com` — likely available

Recommendation: buy **getcoffeesip.com** if available at registrar checkout. It is clear, normal, and better than novelty TLDs for an MVP.

### 4. If time remains: mobile UX pass

- Clean public guest flow.
- Make the value proposition obvious above the fold.
- Make request types feel playful but understandable.
- Reduce friction before checkout.

## 3.5-hour execution plan

### 13:30–14:10 — Lock day-two decisions

- Confirm name/domain direction.
- Confirm Stripe-first payment direction.
- Decide whether host auth is password gate or magic-link later.

### 14:10–15:10 — Implement host protection

- Add env-based host password/token.
- Hide host dashboard link from public flow.
- Add simple login screen for host mode.
- Build/test.

### 15:10–16:00 — Payment architecture + API shape

- Add payment statuses and docs.
- Add mock payment provider endpoint if small enough.
- Keep Stripe integration ready but avoid half-baked live payments.

### 16:00–16:35 — Domain + deploy prep

- Buy domain if Bar confirms.
- Prepare Vercel custom domain notes.
- Add env/deploy checklist.

### 16:35–16:55 — Verify and package

- Run build/tests.
- Commit clean slice locally.
- Write short handoff.

## Blunt risk notes

- Do not launch with open host dashboard.
- Do not take real money until storage, host auth, and webhook handling are sane.
- Do not expose Bitcoin to guests; it will make the product feel weird and slower.

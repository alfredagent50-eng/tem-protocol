# Payment Provider Decision

CoffeeSip should not be blocked on Stripe availability in Israel.

## Reality

Stripe is excellent for the product experience we want, but an Israel-based business cannot simply assume Stripe onboarding will work. If Bar opens a US company, Stripe becomes a strong option again. Until then, the app should stay payment-provider-neutral.

## Current implementation

The API exposes one stable product endpoint:

- `POST /payment-intents`

Internally, it now routes through `apps/api/payment-provider.mjs`.

Supported modes:

- `PAYMENT_PROVIDER=mock` — simulated MVP checkout.
- `PAYMENT_PROVIDER=stripe` — real Stripe PaymentIntents when `STRIPE_SECRET_KEY` is configured.
- `PAYMENT_PROVIDER=grow | payplus | tranzila | allpay` — provider placeholders for Israeli/local PSP evaluation.

This keeps the guest flow stable while we choose the processor.

## Practical options

### Option A — US company + Stripe

Best long-term developer/product path.

Pros:
- Best checkout UX.
- Apple Pay/card support is straightforward.
- Strong APIs, webhooks, fraud tooling.
- Easier global expansion.

Cons:
- Requires company/bank/tax setup.
- Not a same-hour solution.

### Option B — Israeli PSP first

Likely candidates to evaluate: Grow/Meshulam, PayPlus, Tranzila, Allpay/Hyp.

Pros:
- Works for an Israeli business.
- Faster legal/commercial fit locally.
- Some providers support payment links, hosted checkout, Bit, cards, and possibly Apple Pay/Google Pay through their stack.

Cons:
- APIs/UX are usually less clean than Stripe.
- Hosted checkout may feel less polished.
- International guest experience may be weaker.

### Option C — temporary manual/payment-link checkout

Use provider payment links while CoffeeSip validates demand.

Pros:
- Fastest to launch real money.
- Avoids overbuilding before demand proof.

Cons:
- Less seamless.
- More manual reconciliation.
- Webhooks/lifecycle may be weaker at first.

## Recommendation

Do **not** stop product work for Stripe.

Short term: keep `PAYMENT_PROVIDER=mock` in production until real payments are legally/commercially chosen, and build the guest/host lifecycle around the stable payment intent abstraction.

Parallel track: Bar chooses between:

1. US entity → Stripe.
2. Israeli PSP → hosted checkout/API integration.

Merlin should keep the code provider-neutral so either path plugs in with minimal rewrite.

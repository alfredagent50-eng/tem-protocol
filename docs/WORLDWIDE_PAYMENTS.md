# Worldwide Payments Plan

CoffeeSip should feel global from day one.

It is not a close-friends tipping app. It is for weak-tie access: people who know each other from the internet, a group chat, a community, a conference, social media, or a friend-of-a-friend context. The payment is a clean commitment layer that makes the ask less awkward.

## Guest checkout principle

Guests should pay with the fastest familiar method available in their country:

- Apple Pay
- Google Pay
- Credit/debit card
- Link / one-click card reuse where available
- Local currency where possible

Guests should not see Bitcoin, sats, USDT, wallets, or crypto terminology.

## Default MVP currency

Use **USD** as the global default demo currency.

Later, support host-configured/localized currencies:

- USD
- EUR
- GBP
- ILS
- more based on Stripe country/currency support

## Stripe-first architecture

Stripe is the best first integration because it gives us:

- Apple Pay and Google Pay through Payment Element / Checkout
- Card support globally
- Webhooks for reliable paid-state transitions
- Multi-currency support
- A familiar compliance surface compared with building payments ourselves

## Request/payment lifecycle

Target lifecycle:

1. Guest chooses ask + slot.
2. API creates request as `pending_payment`.
3. API creates Stripe Checkout Session / PaymentIntent.
4. Guest pays with Apple Pay/card.
5. Stripe webhook marks request `host_review`.
6. Host accepts or rejects.
7. If accepted: slot becomes committed/busy.
8. If rejected: later behavior can refund, release, or keep as paid offer depending on product rules.

## Host-side Bitcoin conversion

Bitcoin conversion is a host payout preference, not guest UX.

Host payout settings later:

- Keep fiat
- Convert some percentage to BTC
- Convert 100% to BTC

Implementation should start mocked. Real conversion requires country/legal/KYC decisions and provider selection.

Possible providers to evaluate later:

- Strike
- River
- Coinbase
- Kraken
- regulated local on/off-ramp depending on host country

## Open decisions before real money

- Are rejected requests auto-refunded or held as paid bids until expiry?
- Does CoffeeSip charge platform fees immediately?
- Which countries do we support first for hosts?
- Do hosts need KYC before accepting real paid asks?
- What is the minimum viable price after card fees?

## MVP rule

Do not take real money until auth, durable storage, webhook verification, and basic refund/acceptance rules are in place.

# Payments Vision

Bar's preferred long-term payment experience is **not crypto-first for guests**.

## Guest experience

The guest should pay in the most convenient way possible:

- Apple Pay
- Credit/debit card
- Two-click checkout
- Local currency when possible: ILS, USD, EUR, etc.

The guest should not need to understand Bitcoin, USDT, wallets, sats, or crypto rails.

## Host / Bar experience

Bar wants incoming fiat payments — even tiny payments — to be automatically converted into Bitcoin.

The product should feel like a playful paid-availability tool on the surface, but underneath it can become a small automatic Bitcoin savings engine:

1. Guest pays with Apple Pay/card.
2. Payment lands through a fiat payment provider.
3. Platform takes fee if relevant.
4. Remaining amount is converted automatically into Bitcoin for the host.
5. Host accumulates small payments over time as BTC savings.

## Product framing

This expands `tem-protocol` beyond scheduling. It becomes:

- paid access to time/attention/presence
- anti-flake commitment layer
- micro-earning tool
- automatic Bitcoin savings layer

## Likely architecture direction

Short term:

- Stripe Checkout / Payment Element for Apple Pay + cards
- Store payment intents in DB
- Mock BTC conversion until real provider is selected

Medium term:

- Stripe for fiat collection
- BTC conversion provider such as Strike, River, Coinbase, Kraken, or another regulated on/off-ramp depending on country support
- Host payout settings: keep fiat, convert % to BTC, convert all to BTC

Open questions:

- Which countries/currencies should be supported first?
- Do hosts receive BTC directly or does platform custody temporarily?
- What are the legal/KYC requirements for automatic conversion?
- Are tiny payments economically viable after card fees?

## Important product decision

Do **not** force crypto UX on guests. Crypto can be the host-side savings destination, not the guest-side payment method.

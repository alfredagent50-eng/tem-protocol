# tem-protocol

**Time Equals Money.**

`tem-protocol` is an open-source scheduling and payment protocol for people whose time has economic value.

The core idea is simple: if someone wants to reserve your time, they should put money behind that intent. Bookings can require a deposit, a micro-payment, or a higher competing offer for an already-requested slot — with the calendar owner always retaining final approval.

## Why

People casually book time, cancel, no-show, or override existing commitments because the cost is invisible. `tem-protocol` makes time commitments explicit, priced, and programmable.

This starts as a practical product for paid calls and consulting, but the deeper goal is a protocol for market-priced human availability.

## Core workflow

1. A host connects availability, similar to Calendly.
2. A guest chooses an available time slot.
3. The slot has a minimum required payment/deposit.
4. The guest pays with supported rails, initially planned around crypto-native micro-payments such as sats/Lightning and stablecoins like USDT/USDC.
5. The booking is confirmed according to the host's rules.
6. If a slot is already occupied or requested, another guest may submit a higher offer.
7. The host can accept or reject competing offers; the protocol should not auto-displace meetings without consent.

## Product principles

- **Time has a price.** Even tiny payments change behavior.
- **Consent beats auction mechanics.** The owner of the calendar decides.
- **Micro-payments matter.** The product should work for small amounts, not only expensive consulting calls.
- **Open protocol, useful app.** The hosted app should be polished, but the underlying primitives should be open and composable.
- **No dark patterns.** Guests should understand what they are paying and whether it is refundable.

## Planned surfaces

- Web app for hosts and guests
- iOS-oriented experience for quick booking, approval, and notifications
- Public booking pages
- API/protocol layer for integrations

## Early architecture direction

This repository will likely become a TypeScript monorepo:

- `apps/web` — web app
- `apps/api` — backend/API service
- `apps/ios` — future iOS client or Expo app
- `packages/core` — shared domain models and protocol logic
- `packages/payments` — payment rail abstractions
- `packages/calendar` — calendar provider abstractions
- `docs` — protocol notes, architecture, roadmap, governance

## Status

Very early. We are currently shaping the protocol, product scope, and first MVP.

## License

MIT, unless changed before the first serious release.

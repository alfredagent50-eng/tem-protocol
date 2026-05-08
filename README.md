# tem-protocol

**Time Equals Money.**

`tem-protocol` is the open-source scheduling and payment protocol layer behind **CoffeeSip** — the public product/brand we ship today. The protocol exists for people whose time has economic value.

The core idea is simple: if someone wants to reserve your time, they should put money behind that intent. Bookings can require a deposit, a micro-payment, or a higher competing offer for an already-requested slot — with the calendar owner always retaining final approval.

## CoffeeSip vs. tem-protocol

- **CoffeeSip** is the live, public-facing product/brand. It's what users sign up for, book through, and pay through today.
- **tem-protocol** is the underlying protocol layer — currently being extracted out of the CoffeeSip web/api code in this repository.

## Why

People casually book time, cancel, no-show, or override existing commitments because the cost is invisible. `tem-protocol` makes time commitments explicit, priced, and programmable.

This starts as a practical product (CoffeeSip) for paid calls and consulting, but the deeper goal is a protocol for market-priced human availability.

## Core workflow

1. A host connects availability, similar to Calendly.
2. A guest chooses an available time slot.
3. The slot has a minimum required payment/deposit.
4. The guest pays through a supported rail. **Today: Stripe.** Planned: Apple Pay, Lightning (sats), and Web3 wallets such as MetaMask / Rabby for stablecoin payments — built on top of the current Stripe integration, not replacing it.
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

- Web app for hosts and guests (live as CoffeeSip web)
- Public booking pages (live as CoffeeSip web)
- API/protocol layer for integrations (in this repo, in extraction)
- **Roadmap:** an iOS-oriented experience for quick booking, approval, and notifications. Not built yet — there is no `apps/ios` in this repo today.

## Repository layout

This repository is a monorepo. The web app is TypeScript; the API is currently plain Node.js (`.mjs`) with a planned migration to TypeScript.

- `apps/web` — web app (TypeScript, Vite + React) — **live**
- `apps/api` — backend/API service (Node.js `.mjs`, planned TS migration) — **live**
- `packages/core` — *scaffolding/placeholder* for protocol-layer extraction. Not yet imported by anything in `apps/`.
- `packages/payments` — *scaffolding/placeholder* for payment rail abstractions. Not yet imported by anything in `apps/`.
- `packages/calendar` — *scaffolding/placeholder* for calendar provider abstractions. Not yet imported by anything in `apps/`.
- `docs` — protocol notes, architecture, roadmap, governance

The `packages/*` directories are reserved for the protocol-layer extraction as CoffeeSip's domain logic gets pulled out of `apps/web` and `apps/api`. They are not consumed by the live product yet.

## Status

Early. CoffeeSip is the live product surface; `tem-protocol` is the protocol being shaped beneath it. We are currently working through MVP scope, payment rail expansion, and the protocol/app extraction.

## License

MIT, unless changed before the first serious release.

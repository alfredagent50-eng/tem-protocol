# Architecture

`tem-protocol` should separate product UX from protocol primitives.

## Layers

1. **Availability layer**
   - Host working hours
   - Calendar sync
   - Busy/free windows
   - Slot rules

2. **Pricing layer**
   - Minimum booking price
   - Deposit vs non-refundable payment
   - Dynamic pricing by time, urgency, guest, or slot contention
   - Competing offers for occupied/requested slots

3. **Commitment layer**
   - Booking request
   - Payment proof / escrow state
   - Host approval or automatic confirmation rules
   - Cancellation, no-show, refund, and reschedule policies

4. **Payment rails**
   - Lightning/sats
   - Stablecoins such as USDT/USDC
   - Later: Stripe or fiat rails if useful

5. **Notification layer**
   - Email, push, calendar invite, webhooks

## Important product decision

A competing offer should not automatically replace an existing meeting by default. It should create an offer for the host to accept or reject. This keeps the system human, consensual, and less dystopian.

## MVP recommendation

Start with:

- Public host booking page
- Manual host availability or simple calendar import
- Fixed minimum payment per slot
- Payment intent abstraction, initially mockable
- Booking request lifecycle: requested → paid → confirmed/rejected/cancelled
- Admin/host dashboard

Defer:

- Automatic displacement auctions
- Complex escrow
- Multiple calendar providers
- Native iOS app
- Token/governance mechanics

# Day 1 Handoff — tem-protocol

## Live MVP

- Web: https://tem-protocol.vercel.app
- API: https://tem-protocol-api-production.up.railway.app
- API health: https://tem-protocol-api-production.up.railway.app/health

## What works now

- Guest can choose a request type: Talk, Favor, Hang, Show up, Urgent.
- Guest can choose a slot from best picks or calendar.
- Busy slots hide meeting details and show only the bid needed to compete.
- Guest can submit a mock paid request.
- Host dashboard can accept/pass requests.
- Accepting a request marks that slot as busy / bid-required.
- Web and host dashboard share state through the Railway API.

## Current limitations

- Payment is mocked. No real money yet.
- Storage is JSON-backed on Railway. Good for demo, not real production.
- Design/UX is still rough and needs a serious cleanup.
- Host auth does not exist yet; anyone with the page can switch to host dashboard.
- Calendar is mock data, not connected to Google/Apple calendar.
- Vercel manual deploy works, but GitHub auto-deploy needs GitHub connected in Vercel account settings.

## Recommended next moves

1. Add simple host auth / private host dashboard route.
2. Replace JSON store with Postgres on Railway.
3. Make the public guest page cleaner and mobile-first.
4. Add real host settings: slot length, minimum price, currencies, request types.
5. Add real payment provider abstraction endpoint.
6. Add custom domain after the flow feels safe enough to share.

## Day 1 verdict

We have a public, working prototype. It is not production-safe yet, but it is enough to show people the concept and test whether they understand the value.

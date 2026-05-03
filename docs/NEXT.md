# Next Build Plan

## Immediate

1. Move guest calendar display to consume `GET /market/slots` directly.
2. Replace polling with server-sent events or WebSocket updates.
3. Add host-configurable slot rules: duration, minimum price, accepted currencies.
4. Replace mock payment with a payment provider abstraction endpoint.
5. Replace JSON storage with SQLite/Postgres.

## Product cleanup later

Design still needs a real pass. Current UX is useful for proving the loop, not the final consumer experience.

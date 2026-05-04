# Domain

## Purchased domain

- Domain: `coffeesip.app`
- Registrar: Namecheap
- Purchase date: 2026-05-04
- First-year cost shown at checkout: $12.98 + $0.20 ICANN fee = $13.18
- Domain privacy: enabled/free

## Intended use

`coffeesip.app` should become the public consumer-facing URL for CoffeeSip.

The repo/protocol can remain `tem-protocol`; the user-facing product should say CoffeeSip.

## DNS target

Current deployed web app:

- Vercel URL: `https://tem-protocol.vercel.app`

Next step:

1. Add `coffeesip.app` as a custom domain in Vercel for the web app.
2. Copy Vercel's DNS instructions.
3. Update Namecheap DNS records.
4. Verify HTTPS once Vercel provisions the certificate.

## Notes

`.app` requires HTTPS by design, which is fine because Vercel will provision TLS automatically after DNS is correct.

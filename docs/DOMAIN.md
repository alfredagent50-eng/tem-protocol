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

Configured on 2026-05-04:

- Added `coffeesip.app` to the Vercel `tem-protocol` project.
- Added `www.coffeesip.app` to the Vercel `tem-protocol` project.
- Updated Namecheap nameservers from BasicDNS to Vercel DNS:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`

Verification status:

- Namecheap UI shows Custom DNS with Vercel nameservers saved.
- Public DNS/Vercel may still show old Namecheap nameservers until propagation completes.

## Notes

`.app` requires HTTPS by design, which is fine because Vercel will provision TLS automatically after DNS is correct.

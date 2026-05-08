# CoffeeSip — Brand Kit

The CoffeeSip visual identity. One mark, one wordmark, one lockup. Two typefaces, six colors. Everything below is canonical — design and engineering should consume from here.

> **Mark:** Meridian — a vesica-piscis bean cut by a single tilted line.
> **Production assets:** `apps/web/public/brand/` (see [README](../apps/web/public/brand/README.md)).
> **Visual preview:** `docs/brand-kit.html`.

---

## 1. The mark

Meridian is the CoffeeSip mark. A coffee bean abstracted to a vesica piscis (vertical lens shape). A single tilted line — the meridian — passes through it at ~58° from horizontal. Two visual elements. Paired with `coffeesip` set in Fraunces 400.

The bean reads as coffee without literal coffee-cup imagery. The meridian reads as a clock hand, a sip slicing through, a moment passing. It's both warm (organic shape) and exact (the cut is geometric).

**What it says about CoffeeSip:** *Coffee, but not the cup. Time, but not the clock. Considered, modern, has its own opinion.*

**Where it lives:** everywhere. Scales from 16px favicon (with a thickening variant) to billboard. App icon, business card, social avatar, embedded chip in product chrome — all work.

**Internal detail at small sizes.** The meridian is 4 SVG units on a 100×120 viewBox. Below 24px it disappears. The favicon variant in `apps/web/public/brand/icons/favicon.svg` has a fatter bean and a meridian sized to a 32-unit grid specifically to survive at tab size. That gives us two visual variants of the same mark; the favicon-tuned one is reserved for ≤32px contexts.

### Asset variants

| File                              | Use                                         |
| --------------------------------- | ------------------------------------------- |
| `mark.svg`                        | Default mark, two-color (obsidian + oxblood) |
| `mark-mono.svg`                   | One-color mark, obsidian on light surfaces  |
| `mark-dark.svg`                   | Inverted mark for dark surfaces              |
| `wordmark.svg`                    | Wordmark only (`coffeesip`, Fraunces 400)   |
| `lockup.svg`                      | Mark + wordmark, locked spacing             |
| `mark@{32,64,128,256,512,1024}.png` | Raster exports of `mark.svg`                |
| `mark-mono@…` / `mark-dark@…`     | Raster exports of mono / dark variants      |
| `wordmark@{256,512,1024}.png`     | Raster exports of wordmark                  |
| `lockup@{256,512,1024}.png`       | Raster exports of lockup                    |
| `icons/favicon.svg`               | Favicon-tuned mark (thickened, 32-grid)     |
| `icons/favicon-32.png`            | Raster favicon                              |
| `icons/icon-{16,32,180,192,256,512}.png` | App-icon set (favicon, iOS, Android, OG) |

## 2. Color system

| Token       | Hex       | Role                                                        | Justification                                                                 |
| ----------- | --------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `obsidian`  | `#0E1116` | Primary ink — body text, mark stroke, headlines              | Warm-cool neutral black. Sits next to oxblood without going muddy.            |
| `paper`     | `#F6F4EF` | Primary canvas — page background, app surface                | A warm-neutral off-white, **not** cream. Less ochre, more bone — reads premium / contemporary. |
| `oxblood`   | `#6B1F2E` | Brand primary — CTAs, mark fill, links                       | Wine-deep red. Coffee-adjacent (the color of a long espresso held to the light) but reads as *value*, not *beverage*. Says "this handles money." |
| `clay`      | `#C8533D` | Warm accent — callouts, pulled quotes, success-warmth         | Terracotta. The friendly cousin to oxblood. Use for moments that should feel warm rather than transactional. |
| `mist`      | `#E2E0DA` | Surface elevation, dividers, hover fills                      | Warm gray with a near-imperceptible green undertone. Counterweights clay so layouts don't feel one-temperature. |
| `signal`    | `#C5F45A` | Live-state accent — incoming sip, active session, unread chip | Chartreuse. Used at <1% surface area. The single modern, slightly electric color in the system — keeps the brand from feeling antique. Reserve for *now*: live session, fresh request, paid-just-now. |

### Contrast notes

| Foreground   | Background    | Ratio    | WCAG (body)        |
| ------------ | ------------- | -------- | ------------------ |
| `obsidian`   | `paper`       | ~16.5:1  | AAA                |
| `paper`      | `oxblood`     | ~9.3:1   | AAA                |
| `paper`      | `obsidian`    | ~16.5:1  | AAA                |
| `obsidian`   | `clay`        | ~6.0:1   | AA                 |
| `obsidian`   | `signal`      | ~13.4:1  | AAA                |
| `obsidian`   | `mist`        | ~14.0:1  | AAA                |
| `clay`       | `paper`       | ~3.6:1   | **fail body**, AA-large only — never use clay for body text on paper |

Pairings to use:
- **Default page**: `obsidian` on `paper`.
- **Primary button**: `paper` on `oxblood`.
- **Reverse / footer block**: `paper` on `obsidian`.
- **Callout chip**: `obsidian` on `clay`.
- **Live indicator dot**: `signal` (16–24px) inside a `paper` ring.

Pairings to avoid:
- `clay` on `paper` for any text — fails body contrast.
- `oxblood` on `obsidian` — fails everything; use as decorative shapes only.
- `signal` and `oxblood` adjacent at large area — they vibrate. Keep `signal` ≤24px next to oxblood surfaces.

## 3. Typography

Two free Google Fonts. Variable axes used where they earn their keep.

| Role               | Family       | Axis / weight                            | Notes                                                          |
| ------------------ | ------------ | ---------------------------------------- | -------------------------------------------------------------- |
| UI, body           | **Inter**    | wght 400–700, slnt 0                      | Workhorse sans. Numerals are tabular by default. UI tokens, buttons, body. **Primary.** |
| Display, editorial | **Fraunces** | opsz 9–144, wght 300–600, optional SOFT  | Contemporary serif with optical sizing. The brand voice carrier. **Editorial.** |

### Type scale

Designed to feel editorial at the top end and crisp at the small end. Line-heights are tuned per size — looser at body, tighter at display.

| Token         | Family     | Size / line-height | Weight | Tracking | Use                                      |
| ------------- | ---------- | ------------------ | ------ | -------- | ---------------------------------------- |
| `display-2xl` | Fraunces   | 96 / 0.95          | 400    | -0.02em  | One per page. Marketing hero only.       |
| `display-xl`  | Fraunces   | 72 / 1.00          | 400    | -0.02em  | Section openers, big quote.              |
| `display-l`   | Fraunces   | 56 / 1.05          | 400    | -0.01em  | Subhero, page title.                     |
| `h1`          | Fraunces   | 40 / 1.1           | 500    | -0.01em  | Article-level headline.                  |
| `h2`          | Fraunces   | 28 / 1.2           | 500    | -0.005em | Section heading.                         |
| `h3`          | Inter      | 20 / 1.3           | 600    | 0        | Card title, modal title.                 |
| `body-l`      | Inter      | 18 / 1.55          | 400    | 0        | Long-form reading.                       |
| `body`        | Inter      | 16 / 1.55          | 400    | 0        | Default UI body.                         |
| `caption`     | Inter      | 14 / 1.45          | 500    | 0.01em   | Helper text, metadata.                   |
| `micro`       | Inter      | 12 / 1.4           | 600    | 0.12em   | Eyebrow labels (`UPPERCASE`).            |

### Pairing rules

- Never set body in Fraunces below 18px — the optical sizing axis trades sharpness for color below that.
- Never set headlines in Inter above h2 — they look like UI labels at scale.
- Numerals: Inter has tabular numerals via `font-feature-settings: 'tnum'` — turn that **on** anywhere money or time is tabulated.

## 4. Component tokens

### Spacing scale

Linear-ish, snapping to 4-pixel grid. Generous at the top end so layouts breathe.

`space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 24 · `space-6` 32 · `space-7` 48 · `space-8` 64 · `space-9` 96 · `space-10` 128

### Radii

Restrained. Coffee-warm should not mean rounded-cute.

| Token         | Value | Use                                          |
| ------------- | ----- | -------------------------------------------- |
| `radius-sm`   | 4     | Inputs, code blocks, tight chips             |
| `radius-md`   | 10    | Cards, modal bodies                          |
| `radius-lg`   | 18    | Hero cards, feature blocks                   |
| `radius-pill` | 999   | Buttons, status chips                        |
| `radius-square` | 0   | Footer block, photographic crops             |

### Shadows

Single-layer drop shadows. The brand is quiet — no card lift past `e2`.

| Token  | Definition                                    | Use                                    |
| ------ | --------------------------------------------- | -------------------------------------- |
| `e0`   | none                                           | Default card                           |
| `e1`   | `0 1px 2px rgba(14,17,22,0.06)`               | Hover card, subtle lift                |
| `e2`   | `0 8px 24px rgba(14,17,22,0.10)`              | Modal, popover                         |
| `e3`   | `0 24px 64px rgba(14,17,22,0.14)`             | Hero feature panel only                |

### Motion easings

Each easing is named for the brand voice. Use the duration that matches the action.

| Token         | cubic-bezier               | Duration | When                                                  |
| ------------- | -------------------------- | -------- | ----------------------------------------------------- |
| `ease-firm`   | `0.6, 0.0, 0.4, 1`         | 180ms    | Buttons, taps, anything click-driven. Snaps.          |
| `ease-pour`   | `0.2, 0.8, 0.2, 1`         | 240ms    | UI feedback (toasts, micro-animations). Eases out.    |
| `ease-still`  | `0.16, 1, 0.3, 1`          | 480ms    | Page-level reveals, modals. The sip settles.          |
| `ease-spring` | `0.34, 1.56, 0.64, 1`      | 320ms    | Hover micro-bounces. Gentle.                          |

## 5. Voice

Plural, present, considered. Avoid growth-hacker shouting; avoid apologies. The product handles money, so write like an adult.

### Sample microcopy

1. Empty state — host dashboard:
   > **No sips yet.**
   > Share your link and the first one's on its way.

2. Confirm modal — guest paying for a slot:
   > **Sip locked.**
   > We'll notify you when {{host}} pours. You won't be charged until they confirm.

3. Primary CTA on a host's profile:
   > Reserve a sip — $25 / 15 min

4. Notification toast, after first booking:
   > First sip's on us. $5 credit applied.

5. Failed payment:
   > Couldn't pour that one. Card was declined — try another?

6. Settings, host's "what's your time worth" page:
   > Decide what a sip with you costs. You can always change it.

7. Activity log entry:
   > **@nyla** sipped you for 15 min on Tuesday. Paid $25.

8. Out-bid notification:
   > Someone offered more for that slot. Bump your bid or step back?

### Voice rules

- **Plural, communal.** "We," "our," "the team." Avoid singular "I."
- **Verb-first.** "Reserve a sip," not "Click here to reserve."
- **No apologies for the model.** Don't explain why time costs money — the product premise is self-evident.
- **No metaphor stacking.** "Sip" is the verb; "pour" is the host's action; "slot" is the unit. Don't add "pour over" or "brew" or "drip" — the lingo stays small on purpose.
- **Money is matter-of-fact.** Always show the price up front, never after the click.

## 6. Applied — landing hero

The full visual is rendered in `docs/brand-kit.html`. Outline:

- Background: `paper`. Top-left: lockup at 32px. Top-right: small "live" pill in `signal` if there's an active host.
- Eyebrow: `WHAT'S YOUR TIME WORTH` in `micro`, `obsidian` 60% mix.
- Headline: `Pay for a sip.` in `display-xl`, Fraunces 400, `obsidian`. Below: `Get fifteen minutes with someone whose time matters.` in `body-l`.
- CTA row: primary `Reserve a sip` (`paper` on `oxblood`, `radius-pill`); secondary `See open hosts` (`obsidian` on transparent, underline on hover).
- Hosts strip below: three avatar circles, each with a name, role, sip-price-from chip in `clay`.

The hero deliberately leads with the *price*, not the calendar. The brand asserts up front that this isn't free Calendly — it's monetized time, and that's the value.

## 7. Files produced

| Path                                                  | What                                                |
| ----------------------------------------------------- | --------------------------------------------------- |
| `docs/BRAND_KIT.md`                                   | This document                                       |
| `docs/brand-kit.html`                                 | Visual preview                                      |
| `apps/web/public/brand/`                              | Canonical Meridian assets — SVGs and PNG exports    |
| `apps/web/public/brand/icons/`                        | Favicon + iOS / Android app icons (Meridian)        |
| `apps/web/public/brand/README.md`                     | Asset map — file → use case → hex → font            |

Earlier brand explorations (the calligraphic-S kit, plus two unpicked Meridian-era concepts) are archived under `.archive/` for historical reference.

## 8. Open questions

- **`mist` and `signal` aren't referenced inside any SVG** — they're palette tokens for the product UI, not the logo. Make sure they make it into `tokens.css` before the kit gets adopted in app code.
- **App migration to Meridian** is a separate effort (Phase B). Until then, app code may still reference the legacy palette and S-mark assets.

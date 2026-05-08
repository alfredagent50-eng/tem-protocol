# CoffeeSip Brand Kit — v1

A working palette, type scale, and component-token starter for the CoffeeSip product surface.
This kit extends the locked seed (cream canvas, near-black ink, petrol-navy steam, amber accent, calligraphic S-mark) into a system a product team can ship from.

> Our time's worth a sip.
> Quiet, editorial, slow-specialty. We don't shout — we pour.
> The cup is warm before it's full.

**Status:** v1, light + dark, opinionated. Subject to designer review before lock.
**Anchored on:** `docs/COFFEESIP_BRAND_DIRECTION.md` and the seed sheet at `~/Desktop/coffeesip-s-aroma-brand.jpg`.

---

## 1. Color system

### 1.1 Locked seed (do not change)

| Token         | Hex       | Role                                                |
| ------------- | --------- | --------------------------------------------------- |
| `cream`       | `#F1ECE2` | Primary canvas, page background, product surface    |
| `ink`         | `#161616` | Primary text, S-mark stroke, high-contrast UI       |
| `petrol`      | `#2C5A6E` | Brand accent, primary CTA fill, the steam in the S  |
| `amber`       | `#B9892C` | Warm accent, the amber dot, decorative highlight    |

### 1.2 Secondary brand tones

Two siblings to the seed — one deeper, one softer — so layouts have somewhere to go beyond cream and ink without breaking the warm-minimalism vibe.

| Token       | Hex       | Use                                                                        |
| ----------- | --------- | -------------------------------------------------------------------------- |
| `espresso`  | `#2B1D14` | Reverse-block surfaces, footer, photography overlays, app-icon background  |
| `foam`      | `#FAF7F0` | Lifted card surface on cream, subtle elevation, modal bodies               |

Why these and not generic browns/whites: `espresso` is warm-black tinted toward roasted bean rather than blue-gray, so it sits next to ink without fighting it. `foam` is one half-step lighter than cream — enough to create surface hierarchy, not so much that it reads as white.

### 1.3 Neutral scale

A 9-step scale anchored at the seed's `cream` and `ink`. Built around the cream's warm undertone (slight ochre) so greys never read cool/digital.

| Token        | Hex       | Use                                                       | Contrast on cream | AA body |
| ------------ | --------- | --------------------------------------------------------- | ----------------- | ------- |
| `foam-50`    | `#FAF7F0` | Cards above cream, popovers                               | —                 | —       |
| `cream-100`  | `#F1ECE2` | **Seed.** Primary background                              | —                 | —       |
| `stone-200`  | `#E4DDD0` | Subtle dividers, hover-fill on cream, table zebra         | 1.10:1            | n/a     |
| `stone-300`  | `#CFC6B5` | Borders, input outlines, disabled fill                    | 1.32:1            | n/a     |
| `stone-400`  | `#A89E8C` | Decorative rules, low-emphasis icons                      | 2.25:1            | fail    |
| `stone-500`  | `#6E6557` | Muted body, captions, helper text                         | 4.87:1            | **AA**  |
| `stone-600`  | `#4F4A41` | Secondary body, metadata                                  | 7.47:1            | **AAA** |
| `ink-700`    | `#2A2723` | Body text alt, near-black with warmth                     | 13.40:1           | **AAA** |
| `ink-900`    | `#161616` | **Seed.** Primary text                                    | 15.37:1           | **AAA** |

Use `stone-300` for borders, `stone-500` for the lowest copy that still has to be readable, `stone-600`+ for anything you'd actually call body text.

### 1.4 Semantic colors

Tuned for the warm palette. The spec is "ink-coded coffee shop chalkboard," not Bootstrap.

| Token          | Hex       | Role                          | On cream | On ink |
| -------------- | --------- | ----------------------------- | -------- | ------ |
| `success-moss` | `#52704A` | Confirmation, paid, sip-sent  | 4.72:1 **AA** | 3.25:1 AA-large |
| `warning-ochre`| `#9A5419` | Pending, attention, draft     | 4.88:1 **AA** | 3.12:1 AA-large |
| `error-clay`   | `#9C3F2E` | Failure, refund, blocking     | 5.64:1 **AA** | 2.72:1 fail     |
| `info-petrol`  | `#2C5A6E` | Notice, neutral status (= seed petrol) | 6.38:1 **AA** | 2.40:1 fail |

Notes:
- The brand's petrol *is* the info color — there's no separate "blue." Less surface area, more cohesion.
- `warning-ochre` is the **status** ochre. The decorative `amber #B9892C` is brand-only; never use raw amber for warning text.
- `success-moss` was tuned away from emerald/lime so it sits next to amber without clashing. Think coffee leaf, not Slack green.
- Error and warning should always carry an icon — color alone is insufficient (and a few of these are AA-large only on dark, so icon + text is non-negotiable).

### 1.5 Pairing rules (light mode)

| Foreground   | Background    | OK for                          |
| ------------ | ------------- | ------------------------------- |
| `ink-900`    | `cream-100`   | Body, headlines (default)       |
| `ink-900`    | `foam-50`     | Body in cards                   |
| `cream-100`  | `petrol`      | Primary button, hero block      |
| `cream-100`  | `espresso`    | Footer, photo caption block     |
| `ink-900`    | `amber`       | Pull-quote chip, callout (AA, 5.75:1) |
| `petrol`     | `cream-100`   | Link text, secondary headlines  |
| `amber`      | `ink-900`     | Accent text on espresso/dark hero |
| `amber`      | `cream-100`   | **Decorative only** (2.67:1 — fails AA). Use as 1px underline, dot, icon, or for ≥24px display weight only. Never body. |

---

## 2. Dark mode

Mirror of the light system, tuned so the warmth survives. Dark mode is **espresso-tinted**, never pure `#000`. Petrol and amber are re-balanced because their light-mode hex values go neon on dark.

### 2.1 Dark surfaces & neutrals

| Token              | Hex       | Light-mode counterpart       | Use                                  |
| ------------------ | --------- | ---------------------------- | ------------------------------------ |
| `dark-base`        | `#1C1612` | `cream-100`                  | Page background                      |
| `dark-surface-1`   | `#241D17` | `foam-50`                    | Cards above base                     |
| `dark-surface-2`   | `#322920` | `stone-200`                  | Hover, raised surfaces, modals       |
| `dark-border`      | `#4A3D31` | `stone-300`                  | Borders, dividers                    |
| `fog-400`          | `#B8AE9A` | `stone-500`                  | Muted body                           |
| `fog-200`          | `#D6CDB9` | `stone-600` (inverted)       | Secondary body                       |
| `cream-text`       | `#EFE9DD` | `ink-900` (inverted)         | Primary text on dark                 |

Contrast on `dark-base #1C1612`:
- `cream-text`: 14.81:1 — **AAA**
- `fog-200`: ~10.2:1 — **AAA**
- `fog-400`: 8.15:1 — **AAA**

### 2.2 Re-tuned brand accents on dark

| Token         | Hex       | Light counterpart | On dark-base | Notes                                  |
| ------------- | --------- | ----------------- | ------------ | -------------------------------------- |
| `petrol-200`  | `#7CB1C7` | `petrol`          | 7.65:1 AAA   | Lighter steam — petrol on dark fails AA, this replaces it for text & links |
| `amber-200`   | `#E0AE54` | `amber`           | 8.83:1 AAA   | Warmer amber, still feels gold not yellow |

### 2.3 Semantic on dark

| Token              | Hex       | On dark-base | AA body |
| ------------------ | --------- | ------------ | ------- |
| `success-moss-200` | `#85B273` | 7.34:1       | **AAA** |
| `warning-ochre-200`| `#E0AE54` | 8.83:1 (= amber-200) | **AAA** |
| `error-clay-200`   | `#D26A56` | 5.06:1       | **AA**  |
| `info-petrol-200`  | `#88BCD0` | 8.65:1       | **AAA** |

### 2.4 What flips, what holds

Flips (light → dark):
- All neutrals invert across the scale — `cream-100` ↔ `dark-base`, `ink-900` ↔ `cream-text`, `stone-300` ↔ `dark-border`, etc.
- `petrol` → `petrol-200` (must lighten)
- `amber` → `amber-200` (must lighten)
- All semantics shift to their `-200` variants.

Holds (constant in both modes):
- The S-mark stays ink in light, cream-text in dark — but the calligraphic petrol stroke and amber dot keep the same visual weight, switching tokens only.
- Brand tokens `petrol` and `amber` retain their *names* across modes — only the resolved hex differs. CSS variable strategy below.

### 2.5 Accessibility shifts

- Dark mode body-text contrast target is **AAA (≥7:1)**, not AA. Espresso-base is dark enough that we have headroom — use it.
- `amber` in light mode is for accents only on cream (2.67:1). In dark mode, `amber-200` is body-safe (8.83:1). This is the inverse of common dark-mode pitfalls; document it.
- Disabled state in dark = `fog-400` at 50% opacity, **not** a darker grey (which disappears against the warm base).

---

## 3. Typography

### 3.1 Family selection

| Slot          | Family            | Why                                                                                  |
| ------------- | ----------------- | ------------------------------------------------------------------------------------ |
| **Primary**   | **Inter**         | Humanist sans, free via Google Fonts, ships with one weight axis. Excellent for UI body and editorial display alike. Variable font keeps payload small. |
| **Display (optional)** | **Fraunces** | Editorial serif companion for "Our time's worth a sip." moments. Quirky, warm, free via Google Fonts. Use sparingly — display only, never body. |
| **Paid upgrade** | **Söhne**      | If/when budget allows. Söhne Buch + Söhne Halbfett would replace Inter 1:1 with no scale changes. The kit is built so this swap is a font-family change, no other token edits. |

Mono needs (code, addresses): **JetBrains Mono** if/when needed; not in v1.

Fallback stack:
```css
font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
font-family: "Fraunces", ui-serif, Georgia, "Times New Roman", serif;
```

### 3.2 Type scale

8-step base scale + 1 display step. Sizes in `px` for clarity; ship as `rem` (16px = 1rem).

| Token         | Size     | Line-height | Tracking   | Weight   | Use                                      |
| ------------- | -------- | ----------- | ---------- | -------- | ---------------------------------------- |
| `caption-12`  | 12 / 0.75rem | 16 (1.33)   | +0.04em    | 500      | Eyebrows, legal, badge text              |
| `small-14`    | 14 / 0.875rem | 20 (1.43)   | +0.005em   | 400/500  | Helper text, table cells, secondary labels |
| `body-16`     | 16 / 1rem    | 24 (1.5)    | 0          | 400      | **Default body.** Long-form reading       |
| `body-lg-18`  | 18 / 1.125rem | 28 (1.56)   | -0.005em   | 400      | Lead paragraphs, long-form articles       |
| `h4-20`       | 20 / 1.25rem  | 28 (1.4)    | -0.005em   | 500      | Card headings, section eyebrow + title    |
| `h3-24`       | 24 / 1.5rem   | 32 (1.33)   | -0.01em    | 500      | Subsection headings                       |
| `h2-32`       | 32 / 2rem     | 40 (1.25)   | -0.015em   | 500      | Page titles                               |
| `h1-44`       | 44 / 2.75rem  | 48 (1.09)   | -0.02em    | 500/600  | Hero headlines (most app contexts)        |
| `display-64`  | 64 / 4rem     | 68 (1.06)   | -0.025em   | 500      | Marketing hero, "Our time's worth a sip." |

### 3.3 Weight usage

| Weight       | Inter axis | When to use                                                  |
| ------------ | ---------- | ------------------------------------------------------------ |
| Light (300)  | 300        | **Avoid for UI.** Reserved for very large display (≥48px) on cream — never on dark, never below 32px. |
| Regular (400)| 400        | Body, captions, small labels                                 |
| Medium (500) | 500        | All headlines h4–display, button labels, active nav         |
| Semibold (600)| 600       | Emphasis within body, primary button on dark, table headers |
| Bold (700)+  | —          | Don't. The brand is quiet. If you reach for 700, use color or size instead. |

CoffeeSip's display style is **medium-weight, tightly tracked, not bold**. That's the editorial signature.

### 3.4 Mobile vs desktop scale rules

The scale above is desktop. On mobile (<640px viewport):

- Steps `display-64` and `h1-44` reduce one slot: `display-64` → `h1-44`, `h1-44` → `h2-32`.
- Body sizes hold (reading is reading).
- Line-heights hold.
- Tracking on display steps relaxes by `+0.005em` to compensate for smaller rendered size.

Express as CSS clamp where possible, e.g. hero:
```css
font-size: clamp(2rem, 4vw + 1rem, 4rem); /* h2 → display */
```

### 3.5 Editorial moments

Reach for **Fraunces** when copy is the product, not the chrome:
- Marketing hero quote
- Empty-state poetry ("Quiet so far.")
- Onboarding chapter titles
- Pull quotes in long-form

Never use Fraunces for: buttons, form labels, tables, navigation.

---

## 4. Component starter tokens

### 4.1 Spacing (4-pt base)

| Token   | Value | Use                                            |
| ------- | ----- | ---------------------------------------------- |
| `s-0`   | 0     | Reset                                          |
| `s-1`   | 4px   | Icon-to-text gap, tight inline                 |
| `s-2`   | 8px   | Compact stack, badge padding                   |
| `s-3`   | 12px  | Form field padding-y, tight card               |
| `s-4`   | 16px  | **Default rhythm.** Card padding, list gap     |
| `s-5`   | 24px  | Section sub-gap, comfortable card padding      |
| `s-6`   | 32px  | Section gap (mobile), card-to-card             |
| `s-7`   | 48px  | Section gap (desktop)                          |
| `s-8`   | 64px  | Hero block, page top padding                   |
| `s-9`   | 96px  | Marketing rhythm, between-major-sections       |

4-pt — not 8-pt — because the kit uses 12px helper text and 20px headings, and we want tokens that snap to those without half-steps.

### 4.2 Border radius

| Token       | Value | Use                                                 |
| ----------- | ----- | --------------------------------------------------- |
| `radius-sm` | 4px   | Inputs, tags, small chips                           |
| `radius-md` | 8px   | Cards, dropdowns, default                           |
| `radius-lg` | 16px  | Modals, hero containers, app icon-style enclosures  |
| `radius-xl` | 24px  | Floating panels, sheet-style mobile drawers         |
| `radius-pill` | 999px | Buttons (matches the seed mockup's "Get Started" pill), avatar, badge |

Note the seed mockup's primary CTA is a **pill** — `radius-pill` is the default button shape, not `md`.

### 4.3 Elevation / shadow

Cream-friendly: shadows use a warm-grey base and stay soft. No iOS-blue or pure-black drop shadows — they read cold against the canvas.

| Token        | Value                                                       | Use                            |
| ------------ | ----------------------------------------------------------- | ------------------------------ |
| `shadow-sm`  | `0 1px 2px rgba(43, 29, 20, 0.06)`                          | Inputs on focus, faint lift    |
| `shadow-md`  | `0 4px 12px rgba(43, 29, 20, 0.08), 0 1px 2px rgba(43,29,20,0.04)` | Cards, dropdowns      |
| `shadow-lg`  | `0 12px 32px rgba(43, 29, 20, 0.10), 0 2px 6px rgba(43,29,20,0.05)` | Modals, popovers     |
| `shadow-hero`| `0 24px 64px rgba(43, 29, 20, 0.14)`                        | Hero card, app-icon glow       |

The shadow color base is `espresso #2B1D14` (not black). On dark mode, shadows reduce to ~50% opacity and add a faint warm-light edge:
```css
--shadow-md-dark: 0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(225, 175, 100, 0.04);
```

### 4.4 Motion

Three named curves, three named durations. The mood is "considered, not snappy."

**Easing:**

| Token            | Cubic-bezier              | Feel                                |
| ---------------- | ------------------------- | ----------------------------------- |
| `ease-pour`      | `cubic-bezier(0.32, 0.72, 0, 1)` | Slow-start, gentle settle. Default for entrances. |
| `ease-sip`       | `cubic-bezier(0.4, 0, 0.2, 1)`   | Symmetric, calm. Default for state changes. |
| `ease-steam`     | `cubic-bezier(0.16, 1, 0.3, 1)`  | Overshoot-y, soft. For micro-delight (mark animation, success ticks). |

**Duration:**

| Token            | ms     | Use                                       |
| ---------------- | ------ | ----------------------------------------- |
| `duration-quick` | 120ms  | Hover, focus, color change                |
| `duration-base`  | 240ms  | Open/close, card lift, default transition |
| `duration-slow`  | 480ms  | Page-level transitions, hero choreography |

Do not exceed `duration-slow` for any interactive feedback — anything longer than 480ms reads as "broken" rather than "considered."

Reduced motion: respect `prefers-reduced-motion: reduce` and collapse all transitions to 0ms (state changes still happen, just instantly).

---

## 5. Voice & tone — sample lines

Working starter set. Not a full voice doc — that's a separate deliverable. These are calibrated to use the "sip" lingo without sliding into saccharine territory.

**Primary CTAs:**
- Save them a sip
- Send the sip
- Pour yourself in    *(login)*
- Start a pour       *(create new)*

**Secondary actions:**
- Hold the cup       *(cancel)*
- Not now, later sip  *(dismiss)*
- See who's poured   *(view list)*

**System messages:**
- *Empty state:* Quiet so far. The first sip starts here.
- *Success:* Sip sent. Their cup is on the way.
- *Pending:* Brewing — give it a moment.
- *Error:* That brew didn't pour. Let's try again.
- *Confirmation modal:* This sip will go through right away. Sure?

**Headlines / brand voice:**
- Our time's worth a sip.
- Small payments, slow conversations.
- Because not every "got a minute?" is free.

Voice rules:
1. **Plural before singular.** "Our," "we," "us" beats "you" and "your" in marketing copy.
2. **No exclamation marks.** The brand doesn't shout.
3. **One coffee word per sentence, max.** "Sip" is the workhorse — don't pile "brew/pour/cup" on top of it in the same line.
4. **Drop the apology.** Never "Sorry to bother you, but…" — the product's whole point is that asking is fine.

---

## 6. Token export — CSS custom properties (starter)

Drop into `:root`. Provided here so engineering can lift it directly.

```css
:root {
  /* Brand */
  --c-cream: #F1ECE2;
  --c-foam: #FAF7F0;
  --c-ink: #161616;
  --c-ink-700: #2A2723;
  --c-petrol: #2C5A6E;
  --c-amber: #B9892C;
  --c-espresso: #2B1D14;

  /* Neutrals */
  --c-stone-200: #E4DDD0;
  --c-stone-300: #CFC6B5;
  --c-stone-400: #A89E8C;
  --c-stone-500: #6E6557;
  --c-stone-600: #4F4A41;

  /* Semantic */
  --c-success: #52704A;
  --c-warning: #9A5419;
  --c-error: #9C3F2E;
  --c-info: var(--c-petrol);

  /* Surfaces (semantic) */
  --c-bg: var(--c-cream);
  --c-bg-elevated: var(--c-foam);
  --c-text: var(--c-ink);
  --c-text-muted: var(--c-stone-600);
  --c-text-subtle: var(--c-stone-500);
  --c-border: var(--c-stone-300);

  /* Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(43, 29, 20, 0.06);
  --shadow-md: 0 4px 12px rgba(43, 29, 20, 0.08), 0 1px 2px rgba(43, 29, 20, 0.04);
  --shadow-lg: 0 12px 32px rgba(43, 29, 20, 0.10), 0 2px 6px rgba(43, 29, 20, 0.05);
  --shadow-hero: 0 24px 64px rgba(43, 29, 20, 0.14);

  /* Motion */
  --ease-pour: cubic-bezier(0.32, 0.72, 0, 1);
  --ease-sip: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-steam: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-quick: 120ms;
  --duration-base: 240ms;
  --duration-slow: 480ms;

  /* Type */
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-display: "Fraunces", ui-serif, Georgia, "Times New Roman", serif;
}

@media (prefers-color-scheme: dark) {
  :root {
    --c-cream: #1C1612;
    --c-foam: #241D17;
    --c-ink: #EFE9DD;
    --c-ink-700: #D6CDB9;
    --c-petrol: #7CB1C7;
    --c-amber: #E0AE54;
    --c-espresso: #0F0B08;

    --c-stone-200: #322920;
    --c-stone-300: #4A3D31;
    --c-stone-400: #6E5E4D;
    --c-stone-500: #B8AE9A;
    --c-stone-600: #D6CDB9;

    --c-success: #85B273;
    --c-warning: #E0AE54;
    --c-error: #D26A56;
    --c-info: var(--c-petrol);
  }
}
```

Engineering note: surface tokens (`--c-bg`, `--c-text`, etc.) reference brand tokens, so most components only ever touch the surface layer. The brand layer flips for dark mode; surfaces inherit automatically.

---

## 7. Open questions for v2

- Is **Söhne** in the budget? If yes, swap on next iteration.
- Do we want a third brand accent for "Bitcoin savings" surfaces (the protocol-side feature)? Current direction: keep the savings UI in petrol — no new color. Revisit if the savings feature gets its own product surface.
- App icon: the seed shows the S-mark on cream. Should there be an inverted dark-mode app icon variant on `espresso`? Recommended: yes, ship both.
- Illustrative photography: is there a treatment direction (warm grain, slight desaturation) for any food/drink imagery? Out of scope for v1.

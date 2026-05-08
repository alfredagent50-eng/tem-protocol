# CoffeeSip Brand Assets

Production-ready Meridian assets. This folder is the canonical source for the CoffeeSip mark, wordmark, lockup, and app icons. Spec lives in [`docs/BRAND_KIT.md`](../../../../docs/BRAND_KIT.md); preview at [`docs/brand-kit.html`](../../../../docs/brand-kit.html).

> **Source of truth:** the `.svg` files. Every `.png` here is a render of the matching `.svg` at a specific width.
> If you need a size that isn't here, render from the SVG — don't upscale the PNGs.

---

## Folder layout

```
apps/web/public/brand/
├── README.md          ← this file
├── mark.svg           ← default two-color mark (obsidian + oxblood)
├── mark-mono.svg      ← one-color mark (currentColor)
├── mark-dark.svg      ← inverted mark for dark surfaces
├── wordmark.svg       ← `coffeesip` set in Fraunces 400
├── lockup.svg         ← mark + wordmark, locked spacing
├── mark@{32,64,128,256,512,1024}.png        ← raster mark
├── mark-mono@{32,64,128,256,512,1024}.png   ← raster mono mark
├── mark-dark@{32,64,128,256,512,1024}.png   ← raster dark mark
├── wordmark@{256,512,1024}.png               ← raster wordmark
├── lockup@{256,512,1024}.png                 ← raster lockup
└── icons/
    ├── favicon.svg          ← favicon-tuned mark (thickened, 32-grid)
    ├── favicon-32.png       ← raster favicon
    ├── icon-16.png          ← favicon (small)
    ├── icon-32.png          ← favicon (standard)
    ├── icon-180.png         ← apple-touch-icon (iOS, paper background)
    ├── icon-192.png         ← Android home screen (paper background, maskable-safe)
    ├── icon-256.png         ← Windows tile / OG fallback
    └── icon-512.png         ← OG image / installable PWA
```

PNGs use transparent backgrounds **except** `icons/icon-180.png` (iOS) and `icons/icon-192.png` (Android maskable), which use the brand `paper` (`#F6F4EF`) backdrop because those platforms don't honor transparency.

---

## Asset → use-case map

| Asset                   | Use case                                                            |
| ----------------------- | ------------------------------------------------------------------- |
| `mark.svg`              | Product chrome on `paper` surfaces; default mark in marketing       |
| `mark-mono.svg`         | Single-ink contexts — embroidery, print, foil, watermarks, badges   |
| `mark-dark.svg`         | Mark on dark surfaces (`obsidian` `#0E1116`, `espresso` `#1A1814`)  |
| `wordmark.svg`          | Wordmark-only contexts (footer, deck title slides, signature)       |
| `lockup.svg`            | Top-of-page navigation, business card, anywhere mark + wordmark fit |
| `mark@*.png`            | Raster fallback for the default mark                                |
| `mark-mono@*.png`       | Raster fallback for the mono mark                                   |
| `mark-dark@*.png`       | Raster fallback for the dark-surface mark                           |
| `wordmark@*.png`        | Raster fallback for the wordmark                                    |
| `lockup@*.png`          | Raster fallback for the lockup                                      |
| `icons/favicon.svg`     | Browser favicon — uses thickened mark for ≤32px                      |
| `icons/favicon-32.png`  | Browser favicon raster fallback                                     |
| `icons/icon-16.png`     | Legacy favicon, smallest tab size                                   |
| `icons/icon-32.png`     | Standard favicon                                                    |
| `icons/icon-180.png`    | `apple-touch-icon` on iOS                                           |
| `icons/icon-192.png`    | Android home-screen icon (PWA manifest)                              |
| `icons/icon-256.png`    | Windows tile / OG fallback / large favicon                          |
| `icons/icon-512.png`    | OG image, installable PWA splash                                     |

---

## Color tokens

Hex values for the six-color palette. Full role/contrast notes in `docs/BRAND_KIT.md`.

| Token       | Hex       | Role                                      |
| ----------- | --------- | ----------------------------------------- |
| `obsidian`  | `#0E1116` | Primary ink                               |
| `paper`     | `#F6F4EF` | Primary canvas                            |
| `oxblood`   | `#6B1F2E` | Brand primary — CTAs, mark fill, links    |
| `clay`      | `#C8533D` | Warm accent — callouts, price chips        |
| `mist`      | `#E2E0DA` | Surface elevation, dividers                |
| `signal`    | `#C5F45A` | Live-state accent (≤1% surface area)       |

The mark itself uses only `obsidian` and `oxblood`. `mark-dark.svg` swaps obsidian for `paper`.

---

## Typography dependencies

The wordmark and lockup are **outlined** to paths in `wordmark.svg` and `lockup.svg`, so they render correctly even when fonts aren't loaded. But anywhere CoffeeSip type appears as live text in a layout, the following webfonts must be present:

| Family       | Where it's used                  | Source                              |
| ------------ | -------------------------------- | ----------------------------------- |
| **Inter**    | UI, body, captions — **primary** | `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700` |
| **Fraunces** | Display, editorial               | `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600` |

Fraunces uses optical sizing (`opsz` 9–144). Don't set Fraunces below 18px in body — the optical sizing axis trades sharpness for color below that.

Inter has tabular numerals via `font-feature-settings: 'tnum'`. Turn that **on** anywhere money or time is tabulated.

---

## When to render new sizes

If you need a width that isn't shipped:

```bash
# from repo root, example: render mark at 96px
rsvg-convert -w 96 apps/web/public/brand/mark.svg > /tmp/mark@96.png
```

Or use any SVG → PNG renderer (Inkscape, Figma export, sharp). **Don't** upscale the existing PNGs — they're rendered fixed-width.

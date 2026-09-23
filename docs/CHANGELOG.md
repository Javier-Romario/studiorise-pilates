# Changelog — Studio Rise Pilates

A record of everything built and changed on this project, in order. Latest first.

---

## 2026-09-23 — Scroll snapping

- Added CSS scroll snapping to every full-page section.
  - `html { scroll-snap-type: y proximity }` (gentle — doesn't trap the tall
    booking widget or the footer).
  - `.p-section { scroll-snap-align: start; scroll-snap-stop: always }` → one
    page per scroll stop.
  - `.booking { scroll-snap-align: start }`.
  - Disabled under `prefers-reduced-motion`.
- Why `proximity` and not `mandatory`: `mandatory` traps the scroll in the tall
  booking section and footer, making them hard to scroll through.

## 2026-09-23 — Parallax matched to Les Lignes exactly

- Reverse-engineered the Showit engine that powers
  `leslignes.showit.site/home-alternative`.
- Found the effect: `bgScroll:"x"` → `pSpeed = 0.5` → `translateY = (scrollY - blockTop) × 0.5`.
  The background scrolls at **50% speed** (image rises half as fast as text).
- Implemented the identical formula in `src/scripts/site.ts`:
  `translateY = (progress - 0.5) × 100vh`.
- `.p-media` set to `200%` tall, `top: -50%` so it never exposes an edge over
  its ±0.5vh travel.
- Note: 50% speed requires 2× zoom (object-fit cover). The hero video is more
  tightly cropped as a result — swap for a wider shot if needed.

### Earlier parallax iterations (superseded)

1. Background moved *up faster* than text (lead) — too subtle.
2. Added zoom (`scale 1→1.06`) + foreground counter-drift — still not it.
3. Reversed to *lag* (image slower than text), travel 30vh.
4. Bumped to 50% speed (final).

## 2026-09-23 — Garet typeface

- Replaced Instrument Serif + Montserrat with **Garet** (Type Forward Foundry,
  "100% Free" license, commercial OK), downloaded from dafont.
- Self-hosted `Garet-Book.woff2` + `Garet-Heavy.woff2` in `src/fonts/`,
  declared via `@font-face` in `global.css` (no Google Fonts requests).
- Book (400) = body/UI, Heavy (800) = display headings. Italic serif accents
  replaced with weight contrast + almond colour.

## 2026-09-23 — Responsive viewport units

- Sections use `100dvh` (dynamic) with `min-height: 100svh` fallback so the
  full-page effect works on mobile without the `100vh` overflow bug.
- ≤680px: compact grids, `.p-content` gains `overflow-y: auto` +
  `justify-content: safe center` so sections scroll internally if too short.

## 2026-09-23 — Glofox booking widget

- Added `Booking.astro` — a non-parallax section (`#book`) holding the Glofox
  `<iframe>`. `src` is configurable via `content.json → booking.glofox.src`.
- Shows a friendly "booking being connected" placeholder until the real embed
  URL is pasted.
- Pointed the "Book a class" CTAs (top bar + hero) to `#book`.
- Fixed a dead `#studio` nav link → renamed to "Book".

## 2026-09-23 — Initial build

- Astro 5 static site, deployed to GitHub Pages via Actions.
- 5 full-screen parallax sections (Hero video, Method, Classes video, Words,
  Visit) + footer.
- Transparent → solid top bar; disappearing-text section ("Breathe / Align /
  Strengthen / Rise").
- Mini-CMS at `/admin` (JSON editor, download/copy/draft, commit-to-GitHub via PAT).
- Real content pulled from the live studiorisepilates.com Wix site (tagline,
  Helena bio, six class names, locations).
- Docs: `docs/ARCHITECTURE.md`, `docs/CODE_STANDARDS.md`, `README.md`.

---

## Project links

- Live: https://javier-romario.github.io/studiorise-pilates/
- Admin: https://javier-romario.github.io/studiorise-pilates/admin/
- Repo: https://github.com/Javier-Romario/studiorise-pilates

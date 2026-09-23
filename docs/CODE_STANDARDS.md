# Code Standards — Studio Rise Pilates

Conventions to keep the codebase consistent and easy for the next agent (human
or AI) to pick up.

---

## 1. Astro components

- **One component, one job.** A component renders either a section of the page
  or a reusable primitive (`ParallaxSection`). Don't mix both.
- **Props over imports.** Section components take typed props (`data: Hero`,
  `data: Method`, …) and never import `content.json` themselves. Only
  `src/pages/index.astro` and `src/pages/admin.astro` read `src/lib/content.ts`.
- **Typed.** Every component's `Props` interface references types from
  `src/lib/types.ts`. No `any` in component frontmatter.
- **Slots for section chrome.** Reusable chrome (media layer, overlay, content
  wrapper) lives in `ParallaxSection.astro`; specific content is passed as a
  slot.
- **Classes, not inline styles** — except where a value must come from JS/data
  (rare). Keep styling in `global.css` or a component `<style>`.

### Template pattern

```astro
---
import ParallaxSection from './ParallaxSection.astro';
import type { Section } from '../lib/types';

interface Props {
  data: Section;
}

const { data } = Astro.props;
---

<ParallaxSection id={data.id} media={data.media}>
  <p class="eyebrow">{data.eyebrow}</p>
  <h2 class="section-heading">{data.heading}</h2>
</ParallaxSection>
```

---

## 2. Content (`src/data/content.json`)

- The JSON is the **single source of truth**. If a value appears in a component
  it must come from here.
- Keep keys **camelCase**, grouped by section (`hero`, `method`, `classes`,
  `words`, `visit`, `footer`).
- Every section that uses a media background has a `media` object:
  `{ "type": "image" | "video", "src", "poster"?, "alt"? }`.
- When you add a key, **also add its type** to `src/lib/types.ts`. The build
  will not type-check the JSON for you — keeping them in sync is a manual rule.
- Validate with `JSON.parse` (or the `/admin` page) before committing. Trailing
  commas or comments are **not** allowed in JSON.

---

## 3. CSS

- **Tokens only.** Always use `var(--token)` from `:root`; never hardcode a hex
  colour in a component. New colours become new tokens.
- **Naming:** BEM-ish, block `__element --modifier` (`.topbar__link`,
  `.p-section`, `.btn--solid`). Section primitives are prefixed `p-`
  (parallax), so `.p-media`, `.p-content`, `.p-overlay`.
- **Fonts:** display = `var(--font-display)`, body/UI = `var(--font-body)`.
- **Motion:** transitions use `var(--ease-out)` / `var(--ease-inout)`.
- Respect `prefers-reduced-motion` (see `global.css`).
- Mobile: sections collapse from `100vh` to `min-height: 100svh` under 680px so
  content can breathe — keep content from overflowing the viewport on desktop.

---

## 4. Scripts (`src/scripts/`)

- Vanilla TypeScript, no framework. DOM effects only — the site must be fully
  readable with JS disabled.
- Scroll work goes through `requestAnimationFrame`-style passive listeners;
  `site.ts` already batches all three behaviours (topbar, parallax, words).
  Add new scroll effects there rather than spawning competing listeners.
- Guard everything with `prefers-reduced-motion`.
- Query by `data-*` attributes (`[data-parallax]`, `[data-word]`,
  `[data-topbar]`), not by fragile CSS selectors.

---

## 5. Assets

- Self-hosted in `public/media/`. Reference them in `content.json` as
  `/media/<file>` and let `asset()` (in `src/lib/base.ts`) handle the base path.
- Videos: `autoplay muted loop playsinline`, with a `poster` image, ~720p to
  keep the repo lean.
- Images: `loading="lazy" decoding="async"` (except the hero poster, which is a
  video poster anyway).

---

## 6. Accessibility

- One `h1` per page (the hero title). Sections use `h2`.
- Nav and buttons have `aria-label`s where they're icon-only.
- Decorative media is `aria-hidden="true"` with meaningful `alt` on content
  images.
- Colour contrast: chalk text on dark imagery keeps an overlay scrim
  (`.p-overlay`) for legibility — don't remove it without checking contrast.

---

## 7. Commits & PRs

- Small, focused commits. `git add` specific files, not `git add -A` blobs.
- One concern per commit (content, styles, a new section, docs).
- After content/structural changes run `npm build` locally before pushing.

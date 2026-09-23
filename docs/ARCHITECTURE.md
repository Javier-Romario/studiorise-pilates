# Architecture — Studio Rise Pilates

A single-page, full-screen parallax site built with **Astro** (static output),
deployed to **GitHub Pages**. All copy and media references live in one JSON
file, so the site is editable through a built-in mini-CMS at `/admin`.

---

## 1. Stack

| Layer      | Choice                        | Why                                                       |
| ---------- | ----------------------------- | --------------------------------------------------------- |
| Framework  | Astro 5 (static)              | Zero-JS-by-default, fast, plain HTML/CSS output           |
| Styling    | Global CSS + component styles | No UI framework; tokens in `src/styles/global.css`        |
| Fonts      | Instrument Serif + Montserrat | Matches the Les Lignes reference aesthetic                |
| Media      | Local files in `public/media` | Self-hosted; no hotlinking dependency                     |
| Content    | `src/data/content.json`       | Single source of truth; imported at build time            |
| CMS        | `/admin` page                 | JSON editor + GitHub API commit (client-side, no server)  |
| Hosting    | GitHub Pages (Actions)        | `main` branch → build → Pages                             |

---

## 2. Directory structure

```
HelenaSite/
├── astro.config.mjs          # site/base config (base = /studiorise-pilates/)
├── package.json
├── tsconfig.json
├── public/
│   ├── media/                # hero.mp4, classes.mp4, *.jpg (self-hosted)
│   └── favicon.svg
├── src/
│   ├── data/
│   │   └── content.json      # ★ THE CONTENT — everything editable lives here
│   ├── lib/
│   │   ├── base.ts           # asset() — prefixes paths with Astro `base`
│   │   ├── types.ts          # TS types for content.json
│   │   └── content.ts        # imports + exports `content` (typed)
│   ├── styles/
│   │   └── global.css        # tokens, reset, topbar, sections, footer
│   ├── scripts/
│   │   └── site.ts           # topbar state + parallax + disappearing words
│   ├── layouts/
│   │   └── Base.astro        # <head>, fonts, global.css
│   ├── components/
│   │   ├── ParallaxSection.astro  # reusable full-screen section (media + overlay + slot)
│   │   ├── TopBar.astro           # transparent → solid header
│   │   ├── Hero.astro             # section 1 (video)
│   │   ├── Method.astro           # section 2 (image)
│   │   ├── Classes.astro          # section 3 (video)
│   │   ├── Words.astro            # section 4 (image, disappearing text)
│   │   ├── Visit.astro            # section 5 (image, locations)
│   │   └── Footer.astro
│   └── pages/
│       ├── index.astro      # composes the 5 sections in order
│       └── admin.astro      # mini-CMS
├── docs/
│   ├── ARCHITECTURE.md      # this file
│   └── CODE_STANDARDS.md
├── .github/workflows/
│   └── deploy.yml           # build + publish to Pages
└── README.md
```

---

## 3. Data flow

```
content.json ──build──▶ index.astro ──▶ section components ──▶ static HTML
        ▲                                              ▲
        │ edit via /admin (commit to GitHub)           │ typed via src/lib/types.ts
        └────────── GitHub Actions rebuild ────────────┘
```

`src/lib/content.ts` imports the JSON and casts it to `SiteContent`
(`src/lib/types.ts`). `index.astro` reads `content` once and passes each
section's slice to its component as a typed prop. Components are **dumb** —
they receive data, never import `content.json` directly. This keeps them
reusable and makes adding sections mechanical.

---

## 4. How the pieces work

### Parallax (full-page scroll)
- Every section is `height: 100vh` (`.p-section`).
- Inside, `.p-media` is `140%` tall, positioned `top: -20%`, and holds the
  `<img>`/`<video>` (`object-fit: cover`).
- `src/scripts/site.ts` computes each section's scroll **progress**:

  ```
  progress = (viewportHeight - section.top) / (viewportHeight + section.height)
            → 0 when entering, 0.5 when centred, 1 when leaving
  ```

- The media is translated up by `progress × 20vh`. Because the layer is 140%
  tall, it always covers the section — one full page of scroll = one full
  parallax travel. **This is the "parallax goes up-to-down" effect.**

### Top bar (transparent → solid)
- `.topbar` is `position: fixed` and transparent by default.
- `site.ts` toggles `.is-solid` when `scrollY > viewportHeight - 80` (i.e. once
  the first full page has been scrolled past). `.is-solid` gives it a chalk
  background and espresso text.

### Disappearing words (`Words.astro`, section 4)
- The section holds N absolutely-stacked words (`[data-word]`).
- `site.ts` maps the section progress to a continuous index `t = progress × N`
  and fades each word in, holds it, then **dissolves** it (opacity + upward
  translate + blur) as the next word takes over.
- `prefers-reduced-motion` shows the first word statically.

### Mini-CMS (`/admin`)
- Loads `content.json` raw, presents a JSON editor, and offers:
  - **Download** the edited JSON → drop into `src/data/content.json`.
  - **Commit to GitHub** via the Contents API using a fine-grained PAT
    (stored in the browser's `localStorage` only). This triggers the deploy
    workflow, so the live site updates after a push.
- No backend: the CMS is a static page that talks to GitHub directly.

---

## 5. Adding a new section (step by step)

1. **Add the content** to `src/data/content.json` (e.g. a `testimonials` key),
   and add a matching interface to `src/lib/types.ts`.
2. **Create a component** `src/components/Testimonials.astro` that accepts a
   typed `data` prop and renders inside `<ParallaxSection>`:

   ```astro
   ---
   import ParallaxSection from './ParallaxSection.astro';
   import type { Testimonials } from '../lib/types';
   interface Props { data: Testimonials }
   const { data } = Astro.props;
   ---
   <ParallaxSection id={data.id} media={data.media}>
     <p class="eyebrow">{data.eyebrow}</p>
     <h2 class="section-heading">{data.heading}</h2>
     <!-- your content -->
   </ParallaxSection>
   ```

3. **Compose it** in `src/pages/index.astro`:

   ```astro
   import Testimonials from '../components/Testimonials.astro';
   <!-- … -->
   <Testimonials data={content.testimonials} />
   ```

4. **Add a nav link** in `content.json` → `nav` (optional).
5. **Media**: drop the image/video in `public/media/` and reference it in
   `content.json` as `/media/your-file.jpg` (or `.mp4` + a `poster`).

That's it — parallax, overlay and section chrome come for free from
`ParallaxSection.astro`. No changes to `site.ts` are needed for a standard
image/video section.

---

## 6. Theme (colours & fonts)

Tokens live in `:root` at the top of `src/styles/global.css`:

| Token            | Value     | Use                                  |
| ---------------- | --------- | ------------------------------------ |
| `--espresso`     | `#805440` | headings/text on light backgrounds   |
| `--espresso-deep`| `#2b1a14` | dark section backgrounds             |
| `--chalk`        | `#fefaf1` | light backgrounds, text on dark      |
| `--bone`         | `#eae0ce` | secondary light                      |
| `--almond`       | `#e9c18e` | accent — buttons, hovers, highlights |
| `--charcoal`     | `#1c1713` | dark sections, footer, body text     |

Fonts are loaded in `src/layouts/Base.astro` (Google Fonts). To self-host for
GDPR/performance, download the woff2 files into `public/fonts/` and swap the
`<link>` for `@font-face` rules.

---

## 7. Deployment

`.github/workflows/deploy.yml` builds `main` with `npm` and publishes `dist/`
to GitHub Pages. The `base` path (`/studiorise-pilates/`) is set in
`astro.config.mjs` and overridable via the `BASE_PATH` env var.

To move to a custom domain (e.g. `studiorisepilates.com`):
1. Set `base: '/'` (and `site` to the final URL) in `astro.config.mjs`.
2. Add the domain in **GitHub → Settings → Pages → Custom domain**.
3. Add a `CNAME` record (and `public/CNAME` file if you prefer).

---

## 8. Notes for future agents

- **Never** hardcode copy in components — put it in `content.json`.
- **Media is self-hosted** — if you hotlink instead, update the licensing note
  in `README.md`.
- The placeholder `Rugby` address and the Instagram handle should be confirmed
  against the live studio before going live (see `README.md → Placeholders`).
- After editing `content.json`, run `npm build` and check the page renders —
  a malformed JSON file breaks the build.

# Studio Rise Pilates

A single-page, full-screen parallax site for **Studio Rise Pilates** — a
boutique Reformer Pilates studio in **Rugby & Hinckley**, founded by
**Helena Dowling**.

Built with [Astro](https://astro.build), deployed to GitHub Pages, with a
built-in mini-CMS at `/admin`.

---

## Quick start

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # static output in dist/
npm run preview # serve the build locally
```

---

## Features

- **5 full-screen sections** with up-to-down parallax (media translates one
  viewport per full scroll).
- **Hero video background** (self-hosted), later sections use images and a
  second video.
- **Transparent → solid top bar** once you scroll past the first full page.
- **Disappearing text** section — "Breathe / Align / Strengthen / Rise" fade in
  and dissolve away as you scroll.
- **Professional footer** with nav, studios, hours and contact.
- **Mini-CMS** at `/admin` — edit `src/data/content.json` in the browser and
  push straight to GitHub (no server needed).

---

## Colour & type

| Palette   | Hex       |
| --------- | --------- |
| Espresso  | `#805440` |
| Chalk     | `#fefaf1` |
| Bone      | `#eae0ce` |
| Almond    | `#e9c18e` |
| Charcoal  | `#1c1713` |

Display & body: **Garet** (geometric sans, self-hosted) — Book `400` for body/UI,
Heavy `800` for headings.

---

## Editing content

Everything editable lives in **`src/data/content.json`**. Either edit it
directly, or open `/admin` for a browser-based JSON editor with:

- Download / copy the edited JSON
- Draft save (localStorage)
- **Commit to GitHub** using a fine-grained PAT (Contents read/write), which
  triggers a rebuild of the live site.

See `docs/ARCHITECTURE.md` for the full schema and how to add new sections.

---

## Deployment

Push to `main` — `.github/workflows/deploy.yml` builds with `npm` and
publishes `dist/` to GitHub Pages.

- Base path is currently `/studiorise-pilates/` (project site). For a custom
  domain, set `base: '/'` in `astro.config.mjs` (see `docs/ARCHITECTURE.md`).

---

## Booking (Glofox)

The site has a ready-made booking section (`#book`) for the **Glofox** widget.
Glofox generates a small iframe embed from its Website Integration Builder.

1. Open https://glofox-website-integration.web.app/
2. Enter the studio's **Branch ID** and generate the **Class Schedule** widget.
3. Copy the generated iframe's `src` (the URL).
4. Paste it into `booking.glofox.src` in `src/data/content.json` (or via `/admin`).

Until then the section shows a friendly "booking being connected" placeholder.

---

## Placeholders to confirm before launch

These came from public sources and should be verified with the owner:

| Item | Current value | Note |
| ---- | ------------- | ---- |
| Hinckley address | 43 Regent Street, Hinckley | Confirmed on studiorisepilates.com |
| Rugby address | The Independent Quarter, Regent Street, Rugby, CV21 2PS | Sibling brand "Rise & Reform" lists 34 Regent Street — **confirm postcode/number** |
| Email | info@studiorisepilates.com | Confirmed |
| Instagram | @studiorisepilates | Handle to confirm |
| Phone | (omitted) | No reliable number found — add when known |
| Hours | "Seven days a week" | Replace with real schedule |
| Glofox widget | not connected | Paste iframe `src` → `booking.glofox.src` |

---

## Docs for future agents

- `docs/ARCHITECTURE.md` — structure, data flow, parallax mechanics, adding sections
- `docs/CODE_STANDARDS.md` — conventions, tokens, accessibility, commit norms

---

## Media credits

- Videos: [Mixkit](https://mixkit.co) (free license)
- Images: [Pexels](https://pexels.com) (free license)
- Font: [Garet](https://www.dafont.com/garet.font) by Type Forward Foundry (100% free)

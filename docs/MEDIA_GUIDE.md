# Media Guide — Sizes, Ratios & Metadata

Everything in `public/media/` is used as a **full-viewport, parallax background**.
The site renders each section at `100dvh` and stretches the media with
`object-fit: cover; object-position: center` (see `ParallaxSection.astro` and
`src/styles/global.css` → `.p-media`). The media layer is `200%` tall so it can
travel during the parallax scroll without exposing an edge.

> **Net effect:** the visible frame is always the **centre crop** of the source
> file. Nothing near the edges survives on every device — and on phones
> (portrait) the horizontal crop is severe. Compose centre-forward.

---

## 1. The one rule that matters

**Put the subject dead-centre, and keep all important content inside the middle
~40% of the frame (both axes).** Treat the outer ~30% on every side as bleed
that will be cropped away on smaller/narrower screens.

A full-body figure, a reformer, or a face placed at an edge will be chopped off
on mobile. Centre it.

---

## 2. Images (`*.jpg`)

Currently: `1920 × 1280` (3:2) JPEG.

| Property   | Minimum        | Recommended      |
| ---------- | -------------- | ---------------- |
| Width      | 2560 px        | 3840 px          |
| Ratio      | 3:2 or 16:9    | 3:2 or 16:9      |
| Format     | JPEG           | JPEG (or WebP/AVIF) |
| Colour     | sRGB           | sRGB, embedded profile |
| Max size   | 500 KB         | ~300–400 KB      |

Why these numbers:

- **2560 px wide** covers a 2× (retina) desktop viewport (1920 CSS px × 2) with
  headroom for the parallax crop.
- **3840 px wide** covers 4K/retina desktops and gives the centre crop enough
  pixels to stay sharp on phones, where only the middle strip of the source is
  shown.
- **3:2 or 16:9** landscape is fine — the site crops to centre, so the ratio
  matters less than centring the subject. Avoid portrait sources: on desktop the
  centre-crop would discard their top and bottom, which is usually where the
  subject is.

### Image export checklist

- [ ] Subject centred horizontally and vertically.
- [ ] ~30% safe bleed on all four edges (nothing important in it).
- [ ] JPEG quality ~75–82, progressive scan on.
- [ ] sRGB colour profile embedded (not Adobe RGB / Display P3).
- [ ] Orientation baked in (EXIF rotation applied — never rely on the EXIF flag).
- [ ] EXIF/GPS metadata stripped (privacy, and it trims file size).
- [ ] Warm, consistent grade matching the palette (espresso / chalk / bone / almond).

---

## 3. Videos (`*.mp4`)

Currently: `1280 × 720` (720p) H.264, 24–25 fps.

| Property   | Minimum          | Recommended       |
| ---------- | ---------------- | ----------------- |
| Resolution | 1920 × 1080      | 3840 × 2160 (4K)  |
| Ratio      | 16:9             | 16:9              |
| Codec      | H.264 (High, yuv420p) | H.264 + WebM (VP9) |
| Frame rate | 24–30 fps        | 25 or 30 fps      |
| Duration   | 10–20 s          | 10–15 s loop      |
| Max size   | 8 MB             | 4–6 MB            |
| Audio      | **none**         | **none**          |

Why:

- **720p is too soft** once the site crops to centre on a retina display. Full HD
  is the floor; 4K gives the centre crop real headroom.
- **16:9** is the universal video shape and matches the poster frames.
- **H.264 + yuv420p** plays everywhere (Safari included). Add a WebM/VP9 source
  only if you wire up `<source>` fallbacks — the current component uses a single
  `src`.
- **No audio track.** Videos autoplay muted; an audio stream is dead weight.
  Strip it during export.

### Video export checklist

- [ ] Muted / no audio track.
- [ ] Seamless loop (first and last frames match, or the cut is invisible).
- [ ] Subject centred; action stays within the middle ~40% of the frame.
- [ ] No baked-in text, captions, logos or watermarks — the site overlays its own.
- [ ] SDR, Rec.709 — no HDR (HDR files look washed-out when tonemapped).
- [ ] Short (10–20 s); the loop repeats, so keep it clean and calm.
- [ ] A poster image exported at the same 16:9 size as the video.

---

## 4. Posters (`.jpg`)

Each video needs a poster (shown before playback, and on reduced-motion/slow
connections):

- Same aspect ratio as the video (16:9).
- A representative, well-composed still from the video (ideally the first frame).
- Same export settings as images (sRGB, centred subject, ~300 KB max).
- Resolution: 1920 × 1080 minimum; 2560 wide recommended to match image specs.

---

## 5. Metadata to set / keep

Set in `src/data/content.json`:

- **`alt`** — every image should have a short, specific description. This is the
  accessibility text. Example already present: `"Woman practising Reformer
  Pilates in a bright studio"`.
- **`poster`** — every `type: "video"` media object must have a poster path.

Strip from the files themselves:

- **GPS / location** EXIF.
- **Camera/serial** EXIF.
- Any embedded ICC profile other than sRGB.

Keep correct:

- **Orientation** baked into pixel data (not an EXIF rotation flag).

---

## 6. File names & where they live

All media goes in `public/media/`, referenced from `content.json` as `/media/<name>`.
Use kebab-case, lowercase, no spaces. Current references:

| Reference                | File                     | Type   |
| ------------------------ | ------------------------ | ------ |
| `/media/hero.mp4`        | `hero.mp4`               | video  |
| `/media/hero-poster.jpg` | `hero-poster.jpg`        | poster |
| `/media/method.jpg`      | `method.jpg`             | image  |
| `/media/classes.mp4`     | `classes.mp4`            | video  |
| `/media/classes-poster.jpg` | `classes-poster.jpg`  | poster |
| `/media/breathe.jpg`     | `breathe.jpg`            | image  |
| `/media/visit.jpg`       | `visit.jpg`              | image  |

---

## 7. Quick reference

| Use        | Ratio  | Min size      | Format      | Budget  |
| ---------- | ------ | ------------- | ----------- | ------- |
| Hero video | 16:9   | 1920×1080     | H.264 MP4   | ≤ 8 MB  |
| Hero poster| 16:9   | 1920×1080     | JPEG        | ≤ 300 KB|
| Section image | 3:2 / 16:9 | 2560 wide | JPEG        | ≤ 400 KB|
| Everything | centre subject, ~30% safe bleed, sRGB, no audio on video, EXIF stripped | | | |

import { defineConfig } from 'astro/config';

// GitHub Pages project site.
// To serve from a custom domain (e.g. studiorisepilates.com), set `site`
// to the final domain and change `base` to '/'.
// The base can also be overridden at build time: `BASE_PATH=/some/path/ npm run build`.
const base = process.env.BASE_PATH ?? '/studiorise-pilates/';

export default defineConfig({
  site: 'https://javier-romario.github.io',
  base,
  // HTML/CSS/JS only — no framework adapter needed.
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});

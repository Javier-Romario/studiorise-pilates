/**
 * Studio Rise — scroll behaviour.
 *  1. Topbar: transparent over the hero, solid once you scroll past the first
 *     full page.
 *  2. Parallax: each section's background media translates up as the section
 *     scrolls through the viewport — completing one full travel per 100vh.
 *  3. Disappearing words: words in the `#words` section fade in, hold, then
 *     dissolve away as the section scrolls.
 */

const reduced =
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const topbar = document.querySelector<HTMLElement>('[data-topbar]');

const mediaEls = Array.from(
  document.querySelectorAll<HTMLElement>('[data-parallax]'),
);

const wordsSection = document.getElementById('words');
const wordEls = Array.from(
  wordsSection?.querySelectorAll<HTMLElement>('[data-word]') ?? [],
);

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** progress of a section across the viewport: 0 = just entering, 1 = just left */
function sectionProgress(section: Element): number {
  const vh = window.innerHeight;
  const rect = section.getBoundingClientRect();
  const total = vh + rect.height;
  if (total === 0) return 0;
  return clamp01((vh - rect.top) / total);
}

function updateTopbar() {
  if (!topbar) return;
  const past = window.scrollY > window.innerHeight - 80;
  topbar.classList.toggle('is-solid', past);
}

function updateParallax() {
  const vh = window.innerHeight;
  for (const el of mediaEls) {
    const section = el.closest('.p-section');
    if (!section) continue;
    const progress = sectionProgress(section);
    // media is 140% tall with top:-20% — travel 20vh up and it still covers.
    const travel = progress * 0.2 * vh;
    el.style.transform = `translate3d(0, ${-travel}px, 0)`;
  }
}

function updateWords() {
  if (!wordsSection || wordEls.length === 0) return;
  const n = wordEls.length;
  const progress = sectionProgress(wordsSection);
  const idx = progress * (n - 1); // continuous index 0..n-1

  wordEls.forEach((el, i) => {
    const d = idx - i; // -1 = entering, 0 = centred, +1 = leaving
    let opacity = 0;
    if (d > -1 && d < 1) {
      const raw = 1 - Math.abs(d);
      opacity = raw * raw * (3 - 2 * raw); // smoothstep ease
    }
    const y = d * 50; // enters from below, dissolves upward
    const blur = (1 - opacity) * 6;

    el.style.opacity = String(opacity);
    el.style.transform = `translateY(${y}px)`;
    el.style.filter = blur > 0.1 ? `blur(${blur}px)` : '';
  });
}

function onScroll() {
  updateTopbar();
  updateParallax();
  updateWords();
}

if (reduced) {
  // still show a static first word; disable motion transforms
  wordEls.forEach((el, i) => {
    el.style.opacity = i === 0 ? '1' : '0';
  });
  updateTopbar();
} else {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
}

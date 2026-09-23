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
  const progress = sectionProgress(wordsSection);
  const n = wordEls.length;
  const t = progress * n; // continuous position across the word list

  wordEls.forEach((el, i) => {
    const local = t - i; // 0 = word's turn starts, 1 = word's turn ends
    let opacity = 0;
    let y = 0;
    let blur = 0;

    if (local >= 0 && local <= 1) {
      const fadeIn = smoothstep(0, 0.3, local);
      const fadeOut = 1 - smoothstep(0.62, 1, local);
      opacity = Math.min(fadeIn, fadeOut);
      const leaving = 1 - fadeOut; // 0 -> 1 as the word dissolves
      y = -leaving * 60;
      blur = leaving * 7;
    }

    el.style.opacity = String(opacity);
    el.style.transform = `translateY(${y}px)`;
    el.style.filter = blur > 0.1 ? `blur(${blur}px)` : '';
  });
}

function smoothstep(a: number, b: number, x: number): number {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
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

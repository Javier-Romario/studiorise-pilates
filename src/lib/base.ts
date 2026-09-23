/** Resolve an asset path against the configured Astro `base`. */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return base + clean;
}

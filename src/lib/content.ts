import raw from '../data/content.json';
import type { SiteContent } from './types';

/** The site's single source of content. Edit `src/data/content.json`
 *  (or use the /admin page) — components read from here at build time. */
export const content = raw as SiteContent;

export const year = new Date().getFullYear();

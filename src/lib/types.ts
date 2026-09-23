/**
 * Types for the single source of truth: `src/data/content.json`.
 * Keep these in sync when you add fields — the admin page and every
 * component rely on them.
 */

export interface MediaRef {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  alt?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Cta {
  label: string;
  href: string;
}

export interface Meta {
  siteName: string;
  fullName: string;
  owner: string;
  tagline: string;
  email: string;
  instagram: string;
  instagramUrl: string;
}

export interface Hero {
  eyebrow: string;
  titleLines: string[];
  subtitle: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  media: MediaRef;
}

export interface MethodPoint {
  title: string;
  text: string;
}

export interface Method {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  points: MethodPoint[];
  founderQuote: string;
  founderName: string;
  media: MediaRef;
}

export interface ClassItem {
  name: string;
  text: string;
}

export interface Classes {
  id: string;
  eyebrow: string;
  heading: string;
  intro: string;
  list: ClassItem[];
  media: MediaRef;
}

export interface Words {
  id: string;
  eyebrow: string;
  words: string[];
  media: MediaRef;
}

export interface Location {
  name: string;
  address: string[];
}

export interface Visit {
  id: string;
  eyebrow: string;
  heading: string;
  subtitle: string;
  locations: Location[];
  cta: Cta;
  media: MediaRef;
}

export interface Booking {
  id: string;
  eyebrow: string;
  heading: string;
  intro: string;
  glofox: { src: string; height: number };
}

export interface Footer {
  blurb: string;
  hours: { label: string; text: string }[];
  contact: { email: string; instagram: string };
  legal: string;
}

export interface SiteContent {
  meta: Meta;
  nav: NavLink[];
  hero: Hero;
  method: Method;
  classes: Classes;
  words: Words;
  visit: Visit;
  booking: Booking;
  footer: Footer;
}

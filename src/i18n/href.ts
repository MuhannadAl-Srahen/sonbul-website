import type { Lang } from './types';

/**
 * Prefixes an internal path with /ar when lang is Arabic, leaves it alone otherwise.
 *
 * Lives outside index.ts so .astro files and pure-data modules can build links without
 * pulling React in through the i18next hook.
 */
export function localizedHref(path: string, lang: Lang) {
  if (lang !== 'ar') return path;
  return path === '/' ? '/ar' : `/ar${path}`;
}

/** Strips the /ar prefix. Anchored so a future /architecture is not mangled. */
export const stripLocale = (path: string) => path.replace(/^\/ar(?=\/|$)/, '') || '/';

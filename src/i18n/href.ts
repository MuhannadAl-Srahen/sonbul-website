import type { Lang } from './types';

/** Splits a href into its path and everything from the first ? or # onwards. */
function splitQuery(href: string): [string, string] {
  const i = href.search(/[?#]/);
  return i === -1 ? [href, ''] : [href.slice(0, i), href.slice(i)];
}

/**
 * Canonical URLs and the sitemap are directory-style, so links must be too.
 *
 * Astro emits dist/about/index.html and canonicalises `/about/`, but every nav link used
 * to say `/about`, so all internal link equity travelled through a non-canonical URL and
 * a redirect hop.
 */
export function withTrailingSlash(path: string) {
  if (!path.startsWith('/')) return path;
  return path.endsWith('/') ? path : `${path}/`;
}

/** Strips the /ar prefix. Anchored so a future /architecture is not mangled. */
export const stripLocale = (path: string) => path.replace(/^\/ar(?=\/|$)/, '') || '/';

/** Drops a trailing slash for comparison. Leaves the bare root alone. */
export const trimSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

/**
 * Prefixes an internal path with /ar when lang is Arabic and normalises the trailing
 * slash, preserving any query string or fragment.
 *
 * Lives outside index.ts so .astro files and pure-data modules can build links without
 * pulling React in through the i18next hook.
 */
export function localizedHref(path: string, lang: Lang) {
  const [p, rest] = splitQuery(path);
  const prefixed = lang !== 'ar' ? p : p === '/' ? '/ar' : `/ar${p}`;
  return withTrailingSlash(prefixed) + rest;
}

import type { Lang } from './types';

/**
 * getStaticPaths helpers for the [...lang] rest param.
 *
 * `lang: undefined` collapses to the un-prefixed English route (/about), while 'ar'
 * produces the prefixed one (/ar/about). Every page under src/pages/[...lang]/ must
 * export getStaticPaths — Astro errors at build time otherwise.
 */
export const localePaths = () => [{ params: { lang: undefined } }, { params: { lang: 'ar' } }];

/**
 * Cross-product of locale × slug, for parameterised sub-routes.
 *
 * Slugs must come from a TypeScript constant, never from a translated JSON array —
 * a route keyed on array position silently changes URLs when a translator reorders it.
 */
export const localeSlugPaths = (slugs: readonly string[]) =>
  slugs.flatMap((slug) => [
    { params: { lang: undefined, slug } },
    { params: { lang: 'ar', slug } },
  ]);

export const langOf = (param: string | undefined): Lang => (param ?? 'en') as Lang;

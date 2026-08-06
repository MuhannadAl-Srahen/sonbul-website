/**
 * Extracted from index.ts so .astro frontmatter and pure-data modules can import the
 * locale type without pulling React (and therefore i18next's whole client bundle)
 * into the server module graph.
 */
export type Lang = 'en' | 'ar';

export const LANGS: readonly Lang[] = ['en', 'ar'];

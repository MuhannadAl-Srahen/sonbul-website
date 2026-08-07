/**
 * The raw translation trees, free of any React import so .astro frontmatter can pull
 * `dict` for <title>/<meta> without dragging React into the server build.
 *
 * Namespace files are shallow-spread into one flat tree per locale, and i18next still
 * receives the single `translation` namespace it always has, so every existing
 * t('a.b.c') key path keeps working unchanged.
 *
 * Each JSON file must own WHOLE top-level keys. If two files both declare `nav`, the
 * spread silently drops one; scripts/check-i18n-parity.mjs guards against that.
 */
import enCommon from './locales/en/common.json';
import enGroup from './locales/en/group.json';
import enTransport from './locales/en/transport.json';
import enProjectServices from './locales/en/project-services.json';
import enLogistics from './locales/en/logistics.json';

import arCommon from './locales/ar/common.json';
import arGroup from './locales/ar/group.json';
import arTransport from './locales/ar/transport.json';
import arProjectServices from './locales/ar/project-services.json';
import arLogistics from './locales/ar/logistics.json';

/**
 * common.json holds the group and shared-page copy; each company owns one file, so an
 * en/ar diff of "just the logistics company" stays reviewable.
 *
 * Every file must own whole top-level keys. This is a shallow spread, so two files
 * declaring the same key would silently drop one. scripts/check-i18n-parity.mjs enforces it.
 */
export const en = {
  ...enCommon,
  ...enGroup,
  ...enTransport,
  ...enProjectServices,
  ...enLogistics,
} as const;

export const ar = {
  ...arCommon,
  ...arGroup,
  ...arTransport,
  ...arProjectServices,
  ...arLogistics,
} as const;

export const dict = { en, ar } as const;

export type Dictionary = typeof en;

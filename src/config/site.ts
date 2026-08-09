/**
 * Organisation constants shared by JSON-LD, the footer and the contact page.
 *
 * Deliberately holds NO origin/URL constant: `site` in astro.config.mjs is the single
 * source of truth for that and is available as `Astro.site` in every .astro file. Adding
 * one here would be a fourth copy to drift.
 */
import type { Lang } from '../i18n/types';

export const SITE_NAME: Record<Lang, string> = {
  en: 'Abu Sonbul Group',
  ar: 'مجموعة ابو سنبل',
};

export const FOUNDING_YEAR = '2008';

export const FOUNDER: Record<Lang, string> = {
  en: 'Raed Abdel Fatah Abu Sonbul',
  ar: 'رائد عبد الفتاح ابو سنبل',
};

export const EMAIL = 'info@abusonbul-transporters.com';

/** Display form is localised in the contact copy; these are the tel: / JSON-LD forms. */
export const PHONES = ['+962795700658', '+962799128641', '+962797188202'] as const;

export const ADDRESS = {
  streetAddress: 'Al-Faisaliah, Sahab',
  addressLocality: 'Amman',
  addressCountry: 'JO',
} as const;

/** Head office, Sahab. Matches the Google Maps embed on the contact page. */
export const GEO = { latitude: 31.854288, longitude: 36.035675 } as const;

/** Countries the group operates in, which drives `areaServed` in the structured data. */
export const AREA_SERVED = ['Jordan', 'Saudi Arabia', 'Iraq', 'Syria'] as const;

/**
 * Social / directory profiles. The single highest-value property for entity resolution
 * in search. Collect LinkedIn, Facebook and the Google Business Profile and add them.
 */
export const SAME_AS: string[] = [];

/**
 * Border crossings served by Abu Sonbul For Logistic Services, behind
 * /logistics/crossings/<slug>.
 *
 * Slugs live here rather than in the translated JSON for the same reason as projects.ts:
 * URLs must not depend on the order of a translated array.
 */
import type { MediaTag } from './media';

export interface CrossingRef {
  slug: string;
  /** Key under logisticsCo.crossings.items.* in the locale files. */
  key: string;
  /** The neighbouring country on the far side, for structured data and copy. */
  corridor: 'SY' | 'IQ' | 'SA';
  tags: MediaTag[];
}

export const CROSSINGS: CrossingRef[] = [
  { slug: 'jaber', key: 'jaber', corridor: 'SY', tags: ['jaber'] },
  { slug: 'tarbil', key: 'tarbil', corridor: 'IQ', tags: ['tarbil'] },
  { slug: 'al-karamah', key: 'alKaramah', corridor: 'IQ', tags: ['al-karamah'] },
  { slug: 'al-omari', key: 'alOmari', corridor: 'SA', tags: ['al-omari'] },
];

export const CROSSING_SLUGS = CROSSINGS.map((c) => c.slug);

export const getCrossing = (slug: string) => CROSSINGS.find((c) => c.slug === slug);

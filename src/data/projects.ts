/**
 * Flagship projects delivered by Raed Abu Sonbul & Partner, behind
 * /project-services/projects/<slug>.
 *
 * Slugs live here rather than in the translated JSON: a route keyed on a JSON array
 * position silently changes its URL the moment a translator reorders the array.
 */
import type { MediaTag } from './media';

export interface ProjectRef {
  slug: string;
  /** Key under projectServices.projects.items.* in the locale files. */
  key: string;
  /** Photos to show on the case study. See mediaFor() in media.ts. */
  tags: MediaTag[];
}

export const PROJECTS: ProjectRef[] = [
  { slug: 'argas-azraq', key: 'argas', tags: ['argas'] },
  { slug: 'adnoc-azraq-om-lahem', key: 'adnoc', tags: ['adnoc'] },
];

export const PROJECT_SLUGS = PROJECTS.map((p) => p.slug);

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);

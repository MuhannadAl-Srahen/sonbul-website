/**
 * The three companies of the Abu Sonbul Group: single source of truth.
 *
 * The navbar, the footer, the gallery filters, the contact prefill, the sitemap
 * priorities, the JSON-LD graph and the per-page <title> suffix all derive from this
 * file. No company fact should be hardcoded into a page or component.
 *
 * Deliberately free of any React or lucide import so BaseLayout.astro can read it
 * without dragging the icon library into the Astro server module graph. The icon per
 * company lives in Header.tsx instead.
 */
import type { GalleryCategory } from './media';

export type CompanyId = 'transport' | 'project-services' | 'logistics';

/**
 * Top-level i18n namespace owning this company's copy.
 *
 * Note `logisticsCo`, not `logistics`: the old group-level `logistics.*` tree is being
 * dissolved and re-authored, and reusing the name would let a half-migrated tree
 * type-check while rendering the wrong copy.
 */
export type CompanyI18nKey = 'transport' | 'projectServices' | 'logisticsCo';

export interface Company {
  id: CompanyId;
  /** Route root, unprefixed. Pass through localizedHref() at render time. */
  base: string;
  i18nKey: CompanyI18nKey;
  /**
   * og:image and JSON-LD primary image for every page under this company.
   *
   * Kept as JPEG deliberately. The on-page versions are WebP, but social crawlers do not
   * reliably render WebP share previews, so these two stay a format every scraper can
   * read, cropped to the 1200x630 that `summary_large_image` expects.
   */
  image: string;
  /**
   * Full-bleed background of this company's hero. Lives here rather than in
   * companyChrome.ts so BaseLayout can preload it without importing a React module.
   */
  heroImage: string;
  /** Gallery categories whose photos belong to this company by default. */
  galleryCategories: GalleryCategory[];
  /** Client logo basenames under /assets/companies/. See logosFor() in clientLogos.ts. */
  clientLogos: string[];
  /**
   * Contextual header links, rendered beside the company switcher.
   *
   * HARD CAP OF 5: at 1024px the bar cannot fit more alongside the switcher, the
   * language link and the quote button. Deeper pages are reached from the landing page's
   * "Know more" cards, not from here.
   */
  nav: { to: string; key: string }[];
}

export const COMPANIES: Company[] = [
  {
    id: 'transport',
    base: '/transport',
    i18nKey: 'transport',
    image: '/assets/hero/hero.jpg',
    heroImage: '/assets/hero/hero.webp',
    galleryCategories: ['transport'],
    clientLogos: [
      'maraii', 'savola', 'pipsico', 'rajhi', 'krbonat', 'yascp', 'obekan', 'mondi',
      'kibar', 'wataneh', 'safwa', 'ucic', 'texofib', 'arabeeh', 'jana', 'kemyan',
      'lion', 'mnaser', 'moasron', 'nabd', 'rabee', 'watad', 'arrow', 'golf',
      'etihad', 'mr', 'yousef',
    ],
    nav: [
      { to: '/transport', key: 'overview' },
      { to: '/transport/services', key: 'services' },
      { to: '/transport/fleet', key: 'fleet' },
      { to: '/transport/routes', key: 'routes' },
      { to: '/transport/cargo', key: 'cargo' },
    ],
  },
  {
    id: 'project-services',
    base: '/project-services',
    i18nKey: 'projectServices',
    image: '/assets/gallery/home-image.jpg',
    heroImage: '/assets/gallery/camps/camps-01.webp',
    galleryCategories: ['camps', 'catering', 'equipment', 'projects'],
    clientLogos: ['adnoc', 'adnocc', 'wfp'],
    nav: [
      { to: '/project-services', key: 'overview' },
      { to: '/project-services/services', key: 'services' },
      { to: '/project-services/camps', key: 'camps' },
      { to: '/project-services/catering', key: 'catering' },
      { to: '/project-services/projects', key: 'projects' },
    ],
  },
  {
    id: 'logistics',
    base: '/logistics',
    i18nKey: 'logisticsCo',
    image: '/assets/hero/hero.jpg',
    // A gantry crane over a loaded trailer in a border yard, the one shot in the library
    // that says what this company actually does.
    heroImage: '/assets/gallery/equipment/equipment-02.webp',
    // No folder of its own; its photos are reassigned out of equipment/ and transport/
    // by the `company` override in the media manifest.
    galleryCategories: [],
    clientLogos: [],
    nav: [
      { to: '/logistics', key: 'overview' },
      { to: '/logistics/services', key: 'services' },
      { to: '/logistics/crossings', key: 'crossings' },
      { to: '/logistics/equipment', key: 'equipment' },
      { to: '/logistics/customs', key: 'customs' },
    ],
  },
];

export const COMPANY_BY_ID = Object.fromEntries(
  COMPANIES.map((c) => [c.id, c]),
) as Record<CompanyId, Company>;

/**
 * The company that owns a path, or undefined for the group pages (/, /about, /services,
 * /gallery, /team, /contact).
 *
 * Resolved once in BaseLayout and passed to both the Header and the SEO component, so
 * the visible navigation and the page's structured data can never disagree.
 */
export function companyFromPath(path: string): Company | undefined {
  const clean = path.replace(/^\/ar(?=\/|$)/, '') || '/';
  return COMPANIES.find((c) => clean === c.base || clean.startsWith(`${c.base}/`));
}

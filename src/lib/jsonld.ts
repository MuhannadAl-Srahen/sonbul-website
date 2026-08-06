/**
 * schema.org graph builders. Pure functions — no React, no Astro globals — so they can
 * be unit-reasoned about and called from any .astro frontmatter.
 *
 * The load-bearing rule here is @id stability across locales. Entity nodes (#group,
 * /transport#org) always use the ENGLISH canonical URL, on both the English and Arabic
 * pages, so search engines merge /transport and /ar/transport into one entity. Only
 * WebPage and BreadcrumbList ids vary per locale, anchored to that page's own canonical.
 * Getting this backwards splits the entity graph in two.
 */
import type { Lang } from '../i18n/types';
import type { Company } from '../data/companies';
import {
  ADDRESS,
  AREA_SERVED,
  EMAIL,
  FOUNDER,
  FOUNDING_YEAR,
  GEO,
  PHONES,
  SAME_AS,
  SITE_NAME,
} from '../config/site';

interface Ctx {
  lang: Lang;
  /** Origin with no trailing slash, e.g. https://www.abusonbul-transporters.com */
  origin: string;
  /** Absolute canonical URL of the page being rendered. */
  canonical: string;
  title: string;
  description: string;
  image: string;
}

const postalAddress = () => ({ '@type': 'PostalAddress', ...ADDRESS });

const areaServed = () => AREA_SERVED.map((name) => ({ '@type': 'Country', name }));

const groupId = (origin: string) => `${origin}/#group`;
const websiteId = (origin: string) => `${origin}/#website`;
const companyOrgId = (origin: string, company: Company) => `${origin}${company.base}#org`;

function organization(ctx: Ctx) {
  return {
    '@type': 'Organization',
    '@id': groupId(ctx.origin),
    name: SITE_NAME.en,
    alternateName: SITE_NAME.ar,
    url: `${ctx.origin}/`,
    logo: { '@type': 'ImageObject', url: `${ctx.origin}/assets/logo/logo.png` },
    description: ctx.description,
    foundingDate: FOUNDING_YEAR,
    founder: { '@type': 'Person', name: FOUNDER.en },
    address: postalAddress(),
    email: EMAIL,
    telephone: PHONES[0],
    areaServed: areaServed(),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: PHONES[0],
        contactType: 'sales',
        availableLanguage: ['en', 'ar'],
      },
    ],
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  };
}

function website(ctx: Ctx) {
  return {
    '@type': 'WebSite',
    '@id': websiteId(ctx.origin),
    url: `${ctx.origin}/`,
    name: SITE_NAME[ctx.lang],
    publisher: { '@id': groupId(ctx.origin) },
    inLanguage: ['en', 'ar'],
  };
}

function webPage(ctx: Ctx, about: string, breadcrumbId?: string) {
  return {
    '@type': 'WebPage',
    '@id': `${ctx.canonical}#webpage`,
    url: ctx.canonical,
    name: ctx.title,
    description: ctx.description,
    isPartOf: { '@id': websiteId(ctx.origin) },
    about: { '@id': about },
    ...(breadcrumbId ? { breadcrumb: { '@id': breadcrumbId } } : {}),
    inLanguage: ctx.lang,
    primaryImageOfPage: { '@type': 'ImageObject', url: ctx.image },
  };
}

/** Crumb `item` URLs stay English-canonical so both locales point at the same entities. */
function breadcrumb(ctx: Ctx, trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${ctx.canonical}#breadcrumb`,
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${ctx.origin}${c.path === '/' ? '/' : c.path}`,
    })),
  };
}

const graph = (nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });

/** The group hub at / and /ar. */
export function groupGraph(ctx: Ctx) {
  return graph([organization(ctx), website(ctx), webPage(ctx, groupId(ctx.origin))]);
}

/**
 * A company landing page or any page beneath it.
 *
 * Deliberately Organization + parentOrganization rather than LocalBusiness: three
 * separately-marked local businesses at one Amman address reads as a spam signal and
 * risks the whole site's local eligibility. The single real LocalBusiness lives on
 * /contact.
 */
export function companyGraph(
  ctx: Ctx,
  company: Company,
  names: { name: string; altName: string; services: string[] },
  /** Extra crumb for the current page when it sits below the company root. */
  leaf?: { name: string; path: string },
) {
  const id = companyOrgId(ctx.origin, company);
  const crumbs = breadcrumb(ctx, [
    { name: SITE_NAME.en, path: '/' },
    { name: names.name, path: company.base },
    ...(leaf ? [leaf] : []),
  ]);

  return graph([
    {
      '@type': 'Organization',
      '@id': id,
      name: names.name,
      alternateName: names.altName,
      url: `${ctx.origin}${company.base}`,
      parentOrganization: { '@id': groupId(ctx.origin) },
      description: ctx.description,
      logo: { '@type': 'ImageObject', url: `${ctx.origin}/assets/logo/logo.png` },
      image: [ctx.image],
      email: EMAIL,
      telephone: PHONES[0],
      address: postalAddress(),
      areaServed: areaServed(),
      knowsLanguage: ['en', 'ar'],
      ...(names.services.length
        ? {
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: names.name,
              itemListElement: names.services.map((s) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: s, provider: { '@id': id } },
              })),
            },
          }
        : {}),
    },
    crumbs,
    webPage(ctx, id, crumbs['@id']),
  ]);
}

/**
 * /about, /services, /gallery, /team — group-owned pages with no company of their own.
 *
 * The Organization node travels with them. Emitting only a WebPage left `isPartOf` and
 * `about` pointing at `#website` and `#group` ids that existed on no page in that
 * document's graph, so those pages carried no organisation markup at all.
 */
export function sharedPageGraph(ctx: Ctx) {
  return graph([organization(ctx), website(ctx), webPage(ctx, groupId(ctx.origin))]);
}

/** /contact only — the one real physical place. */
export function localBusinessGraph(ctx: Ctx) {
  return graph([
    {
      '@type': 'LocalBusiness',
      '@id': `${ctx.origin}/contact#localbusiness`,
      name: SITE_NAME.en,
      alternateName: SITE_NAME.ar,
      parentOrganization: { '@id': groupId(ctx.origin) },
      url: `${ctx.origin}/contact`,
      image: ctx.image,
      email: EMAIL,
      telephone: PHONES[0],
      address: postalAddress(),
      geo: { '@type': 'GeoCoordinates', ...GEO },
      areaServed: areaServed(),
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '08:00',
          closes: '16:00',
        },
      ],
    },
    webPage(ctx, `${ctx.origin}/contact#localbusiness`),
  ]);
}

/** /team/<slug> — previously carried no structured data at all. */
export function personGraph(ctx: Ctx, person: { name: string; jobTitle: string; image?: string }) {
  const id = `${ctx.canonical}#person`;
  return graph([
    {
      '@type': 'Person',
      '@id': id,
      name: person.name,
      jobTitle: person.jobTitle,
      ...(person.image ? { image: person.image } : {}),
      worksFor: { '@id': groupId(ctx.origin) },
      url: ctx.canonical,
    },
    webPage(ctx, id),
  ]);
}

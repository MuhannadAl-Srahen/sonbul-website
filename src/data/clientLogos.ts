import { COMPANY_BY_ID, type CompanyId } from './companies';

/** Every client logo in /assets/companies/, in marquee order. */
export const ALL_LOGOS = [
  'adnoc', 'adnocc', 'arabeeh', 'arrow', 'etihad', 'gig', 'golf', 'go-tech',
  'jana', 'kemyan', 'kibar', 'krbonat', 'lion', 'maraii', 'mnaser',
  'moasron', 'mondi', 'mr', 'nabd', 'obekan', 'pipsico', 'rabee',
  'rajhi', 'safwa', 'savola', 'texofib', 'ucic', 'watad', 'wataneh',
  'wfp', 'yascp', 'yousef',
];

export const logoSrc = (name: string) => `/assets/companies/${name}.webp`;

/** Below this, a company's own row looks thinner than it deserves and we show the group. */
const MIN_OWN_LOGOS = 8;

/**
 * Logos to show on a company's page.
 *
 * Only about 25 of the 32 clients map confidently to one company, so a company with a
 * short list falls back to the full group set under a group heading. Showing three logos
 * would read worse than showing the group's, and inventing the rest is not an option.
 * Callers can use `isGroupSet` to pick the right heading.
 */
export function logosFor(company?: CompanyId): { logos: string[]; isGroupSet: boolean } {
  const own = company ? COMPANY_BY_ID[company].clientLogos : [];
  return own.length >= MIN_OWN_LOGOS
    ? { logos: own, isGroupSet: false }
    : { logos: ALL_LOGOS, isGroupSet: true };
}

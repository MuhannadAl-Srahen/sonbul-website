import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Container, Globe, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { COMPANIES } from '../../data/companies';
import type { Company, CompanyId } from '../../data/companies';
import { companyIcons } from '../ui/companyIcons';

// Shown in the bar when no company owns the route, and in the switcher panel always.
const groupNav = [
  { to: '/about', key: 'about' },
  { to: '/services', key: 'services' },
  { to: '/gallery', key: 'gallery' },
  { to: '/team', key: 'team' },
  { to: '/contact', key: 'contact' },
];

interface Props {
  currentPath: string;
  lang: Lang;
  /** Resolved in BaseLayout by companyFromPath, so the header and the page's structured
      data can never disagree about which company we are in. */
  companyId?: CompanyId;
}

/** `t` is threaded in rather than re-created: one i18next instance per card would be
    three instances per render for no benefit. */
function CompanyCard({
  company,
  lang,
  t,
  active,
  className,
  onNavigate,
}: {
  company: Company;
  lang: Lang;
  t: (key: string) => string;
  active: boolean;
  className?: string;
  onNavigate?: () => void;
}) {
  const Icon = companyIcons[company.id];
  return (
    <a
      href={localizedHref(company.base, lang)}
      onClick={onNavigate}
      aria-current={active ? 'true' : undefined}
      className={clsx(
        'group relative flex gap-3.5 rounded-xl p-3.5 transition-colors duration-200',
        active ? 'bg-primary/10' : 'hover:bg-ink-50',
        className,
      )}
    >
      {active && <span className="absolute inset-y-3 start-0 w-0.5 rounded-full bg-primary" />}
      <span
        className={clsx(
          'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors',
          active
            ? 'bg-primary text-white'
            : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white',
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-ink">{t(`companies.${company.id}.name`)}</span>
          {active && (
            <span className="nav-micro rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {t('nav.youAreHere')}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-ink-400">
          {t(`companies.${company.id}.tagline`)}
        </span>
      </span>
    </a>
  );
}

export default function Header({ currentPath, lang, companyId }: Props) {
  const { t } = useLocale(lang);
  const [open, setOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const company = COMPANIES.find((c) => c.id === companyId);
  const navItems = company ? company.nav : groupNav;
  const ActiveIcon = company ? companyIcons[company.id] : undefined;

  // Navigation is a full page load (no client-side router), so each route change remounts
  // Header fresh — no effect needed to reset `open` / `switcherOpen`.
  // Astro hands us the pathname with a trailing slash ("/transport/") while nav hrefs
  // have none, so both sides get normalised before any comparison.
  const trim = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
  const here = trim(currentPath);

  const isActive = (to: string) => {
    const href = trim(localizedHref(to, lang));
    // "Overview" and the group home mean *this exact page*, so they must not stay lit
    // while you are on a page beneath them. Every other link keeps its descendants —
    // /logistics/crossings should stay active on an individual crossing page.
    const exactOnly = to === '/' || COMPANIES.some((c) => c.base === to);
    if (exactOnly) return here === href;
    // Trailing slash on the prefix so /team does not light up for /teams.
    return here === href || here.startsWith(`${href}/`);
  };

  // The 404 is built once, in English, and served for every unmatched path — so there is
  // no Arabic sibling to switch to. Send the toggle to the other locale's home instead of
  // a URL that would only 404 again.
  const altHref =
    here === '/404'
      ? localizedHref('/', lang === 'ar' ? 'en' : 'ar')
      : lang === 'ar'
        ? currentPath.replace(/^\/ar(?=\/|$)/, '') || '/'
        : localizedHref(currentPath, 'ar');

  const quoteHref = localizedHref(
    company ? `/contact?subject=quote&company=${company.id}` : '/contact?subject=quote',
    lang,
  );

  useEffect(() => {
    if (!switcherOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSwitcherOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!switcherRef.current?.contains(e.target as Node)) setSwitcherOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [switcherOpen]);

  // The drawer is nearly full-height, so stop the page behind it from scrolling. The
  // resize listener matters: the drawer is xl:hidden, so rotating a tablet into landscape
  // with it open used to hide the drawer AND the hamburger while leaving the page locked,
  // with no way to unlock it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onResize = () => {
      if (window.matchMedia('(min-width: 1280px)').matches) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const navLabel = (key: string) =>
    company ? t(`companies.${company.id}.nav.${key}`) : t(`nav.${key}`);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container-page flex h-20 items-center gap-3">
        <a href={localizedHref('/', lang)} aria-label={t('nav.groupHome')} className="flex-shrink-0">
          {/* Intrinsic size from the SVG viewBox (285 x 72.75). Without it `w-auto`
              resolves to 0 until the file loads and the whole bar jumps sideways. */}
          <img
            src="/assets/logo/main-logo.svg"
            alt={t('brand.group')}
            width={141}
            height={36}
            className="h-9 w-auto object-contain"
          />
        </a>

        {/* Company switcher. A disclosure, not a menu: hover panels are unusable on touch
            and the trigger has no destination of its own. */}
        <div ref={switcherRef} className="relative hidden xl:block flex-shrink-0">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setSwitcherOpen((v) => !v)}
            aria-expanded={switcherOpen}
            aria-controls="company-switcher"
            className={clsx(
              'inline-flex items-center gap-2 rounded-lg py-2 ps-2 pe-2.5 text-sm font-semibold transition-colors duration-200',
              switcherOpen ? 'bg-ink/10 text-ink' : 'text-ink hover:bg-ink/5',
            )}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
              {ActiveIcon ? <ActiveIcon className="h-4 w-4" /> : <Container className="h-4 w-4" />}
            </span>
            <span className="max-w-[9rem] truncate 2xl:max-w-none">
              {company ? t(`companies.${company.id}.short`) : t('nav.ourCompanies')}
            </span>
            <ChevronDown
              className={clsx(
                'h-4 w-4 text-ink-400 transition-transform duration-200',
                switcherOpen && 'rotate-180',
              )}
            />
          </button>

          {switcherOpen && (
            <div
              id="company-switcher"
              className="absolute top-full start-0 mt-2 w-[25rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-ink-100 bg-white p-2 shadow-soft"
            >
              <p className="nav-micro px-3.5 pb-1.5 pt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-400">
                {t('nav.ourCompanies')}
              </p>
              {COMPANIES.map((c) => (
                <CompanyCard
                  key={c.id}
                  company={c}
                  lang={lang}
                  t={t}
                  active={c.id === companyId}
                  onNavigate={() => setSwitcherOpen(false)}
                />
              ))}
              {/* Group pages have no room in the bar once a company owns it. */}
              <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 border-t border-ink-100 px-2 pb-1 pt-2.5">
                {groupNav.map((item) => (
                  <a
                    key={item.to}
                    href={localizedHref(item.to, lang)}
                    className="rounded-md px-2 py-1.5 text-xs font-medium text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                ))}
                <a
                  href={localizedHref('/', lang)}
                  className="ms-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-primary transition-all hover:gap-2.5"
                >
                  {t('nav.groupHome')}
                  <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
                </a>
              </div>
            </div>
          )}
        </div>

        <span className="hidden xl:block h-6 w-px flex-shrink-0 bg-ink-100" aria-hidden />

        {/* Contextual nav — the current company's own sections, or the group's. */}
        <nav
          aria-label={company ? t(`companies.${company.id}.short`) : t('nav.explore')}
          className="hidden xl:flex items-center gap-0.5 min-w-0"
        >
          {navItems.map((item) => (
            <a
              key={item.to}
              href={localizedHref(item.to, lang)}
              aria-current={isActive(item.to) ? 'page' : undefined}
              className={clsx(
                'rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap',
                isActive(item.to)
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-ink/75 hover:text-ink hover:bg-ink/5 active:bg-ink/10',
              )}
            >
              {navLabel(item.key)}
            </a>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-2 flex-shrink-0 ms-auto">
          <a
            href={altHref}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink/60 transition-all duration-200 hover:bg-ink/5 hover:text-ink 2xl:px-3"
            aria-label={t('nav.switchLanguage')}
            hrefLang={lang === 'ar' ? 'en' : 'ar'}
          >
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="hidden 2xl:inline">{t('lang.switchTo')}</span>
          </a>
          <a href={quoteHref} className="btn-primary !py-2 !px-4 !text-sm">
            {t('nav.getQuote')}
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="xl:hidden ms-auto rounded-full p-2 text-ink transition-colors hover:bg-ink/5"
          aria-label={t('nav.toggleMenu')}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer — companies as cards first, then the current company's sections. */}
      <div
        id="mobile-nav"
        inert={!open}
        className={clsx(
          'xl:hidden overflow-y-auto overscroll-contain border-t bg-white transition-[max-height] duration-300 ease-in-out',
          open ? 'max-h-[calc(100dvh-5rem)] border-ink-100' : 'max-h-0 border-transparent',
        )}
      >
        <div className="container-page py-4">
          <p className="nav-micro px-1 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-400">
            {t('nav.ourCompanies')}
          </p>
          <div className="grid gap-1.5">
            {COMPANIES.map((c) => (
              <CompanyCard
                key={c.id}
                company={c}
                lang={lang}
                t={t}
                active={c.id === companyId}
                className="border border-ink-100"
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>

          <nav
            aria-label={company ? t(`companies.${company.id}.short`) : t('nav.explore')}
            className="mt-5 flex flex-col gap-1 border-t border-ink-100 pt-4"
          >
            <p className="nav-micro px-1 pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-400">
              {company ? t(`companies.${company.id}.short`) : t('nav.explore')}
            </p>
            {navItems.map((item) => (
              <a
                key={item.to}
                href={localizedHref(item.to, lang)}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.to) ? 'page' : undefined}
                className={clsx(
                  'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                  isActive(item.to) ? 'bg-primary text-white' : 'text-ink hover:bg-ink/5',
                )}
              >
                {navLabel(item.key)}
              </a>
            ))}
            {/* Vertical room exists on mobile, so the group pages stay one tap away. */}
            {company &&
              groupNav.map((item) => (
                <a
                  key={item.to}
                  href={localizedHref(item.to, lang)}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-base font-medium text-ink-500 transition-colors hover:bg-ink/5"
                >
                  {t(`nav.${item.key}`)}
                </a>
              ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-ink-100 pt-4">
            <a
              href={altHref}
              onClick={() => setOpen(false)}
              className="btn-outline"
              hrefLang={lang === 'ar' ? 'en' : 'ar'}
            >
              <Globe className="h-4 w-4" />
              {t('lang.switchTo')}
            </a>
            <a href={quoteHref} onClick={() => setOpen(false)} className="btn-primary">
              {t('nav.getQuote')}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

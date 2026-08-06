import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Globe, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { COMPANIES } from '../../data/companies';
import type { Company } from '../../data/companies';
import { companyIcons } from '../ui/companyIcons';
import { useCanHover } from '../../hooks/useMediaQuery';

interface Props {
  currentPath: string;
  lang: Lang;
}

/**
 * The three companies ARE the navigation.
 *
 * The previous version put a single "Our companies" switcher next to whichever company's
 * links happened to be showing, which made it invisible that the group has three
 * businesses and left visitors unable to tell why the bar kept changing. Now each company
 * is a top-level item that reveals its own sections.
 */
export default function Header({ currentPath, lang }: Props) {
  const { t } = useLocale(lang);
  const canHover = useCanHover();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef(0);

  // Astro serves directory-style URLs, so the pathname carries a trailing slash while nav
  // hrefs do not. Both sides are normalised before any comparison.
  const trim = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
  const here = trim(currentPath);

  const isActive = (to: string) => {
    const href = trim(localizedHref(to, lang));
    if (to === '/') return here === href;
    // Company roots mean *this exact page*, so they do not stay lit on pages beneath them.
    const exactOnly = COMPANIES.some((c) => c.base === to);
    if (exactOnly) return here === href;
    return here === href || here.startsWith(`${href}/`);
  };

  // Whether we are anywhere inside a company, which is what should light its top-level item.
  const inCompany = (c: Company) => here === trim(localizedHref(c.base, lang)) ||
    here.startsWith(`${trim(localizedHref(c.base, lang))}/`);

  const altHref =
    here === '/404'
      ? localizedHref('/', lang === 'ar' ? 'en' : 'ar')
      : lang === 'ar'
        ? currentPath.replace(/^\/ar(?=\/|$)/, '') || '/'
        : localizedHref(currentPath, 'ar');

  // The contact form lives on the landing page now, so the quote button is an anchor.
  const quoteHref = `${localizedHref('/', lang)}#contact`;

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [openMenu]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // The drawer is nearly full-height, so stop the page behind it from scrolling. The
  // resize listener matters: the drawer is hidden above the breakpoint, so rotating a
  // tablet into landscape with it open would leave the page locked and the burger gone.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onResize = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  // A grace period so the pointer can cross the gap between trigger and panel without the
  // menu snapping shut underneath it.
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 160);
  };
  const cancelClose = () => window.clearTimeout(closeTimer.current);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-ink-100">
      <div className="container-page flex h-20 items-center gap-4">
        <a href={localizedHref('/', lang)} aria-label={t('nav.groupHome')} className="flex-shrink-0">
          {/* Intrinsic size from the SVG viewBox (285 x 72.75), so `w-auto` does not
              resolve to 0 and shift the bar while the file loads. */}
          <img
            src="/assets/logo/main-logo.svg"
            alt={t('brand.group')}
            width={141}
            height={36}
            className="h-9 w-auto object-contain"
          />
        </a>

        <div ref={navRef} className="hidden lg:flex items-center gap-1">
          {COMPANIES.map((company) => {
            const Icon = companyIcons[company.id];
            const expanded = openMenu === company.id;
            const current = inCompany(company);

            return (
              <div
                key={company.id}
                className="relative"
                onMouseEnter={canHover ? () => { cancelClose(); setOpenMenu(company.id); } : undefined}
                onMouseLeave={canHover ? scheduleClose : undefined}
              >
                <a
                  href={localizedHref(company.base, lang)}
                  aria-expanded={expanded}
                  aria-current={current ? 'true' : undefined}
                  onClick={(e) => {
                    // Without hover there is nothing to reveal the sections, so the first
                    // tap opens the menu and "Overview" inside it reaches the company page.
                    if (!canHover) {
                      e.preventDefault();
                      setOpenMenu(expanded ? null : company.id);
                    }
                  }}
                  className={clsx(
                    'inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-200',
                    current || expanded ? 'bg-primary text-white' : 'text-ink hover:bg-ink/5',
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{t(`companies.${company.id}.short`)}</span>
                  <ChevronDown
                    className={clsx(
                      'h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200',
                      expanded && 'rotate-180',
                    )}
                  />
                </a>

                {expanded && (
                  <div
                    onMouseEnter={canHover ? cancelClose : undefined}
                    onMouseLeave={canHover ? scheduleClose : undefined}
                    className="absolute top-full start-0 z-50 mt-1.5 w-72 rounded-2xl border border-ink-100 bg-white p-2 shadow-soft"
                  >
                    <p className="px-3 pb-1.5 pt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-400">
                      {t(`companies.${company.id}.name`)}
                    </p>
                    {company.nav.map((item) => (
                      <a
                        key={item.to}
                        href={localizedHref(item.to, lang)}
                        onClick={() => setOpenMenu(null)}
                        aria-current={isActive(item.to) ? 'page' : undefined}
                        className={clsx(
                          'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive(item.to)
                            ? 'bg-primary/10 text-primary'
                            : 'text-ink-600 hover:bg-ink-50 hover:text-ink',
                        )}
                      >
                        {t(`companies.${company.id}.nav.${item.key}`)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 flex-shrink-0 ms-auto">
          <a
            href={altHref}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink/60 transition-all duration-200 hover:bg-ink/5 hover:text-ink"
            aria-label={t('nav.switchLanguage')}
            hrefLang={lang === 'ar' ? 'en' : 'ar'}
          >
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">{t('lang.switchTo')}</span>
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
          className="lg:hidden ms-auto rounded-full p-2 text-ink transition-colors hover:bg-ink/5"
          aria-label={t('nav.toggleMenu')}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer — each company is a labelled group with its own sections listed. */}
      <div
        id="mobile-nav"
        inert={!open}
        className={clsx(
          'lg:hidden overflow-y-auto overscroll-contain border-t bg-white transition-[max-height] duration-300 ease-in-out',
          open ? 'max-h-[calc(100dvh-5rem)] border-ink-100' : 'max-h-0 border-transparent',
        )}
      >
        <div className="container-page py-4">
          {COMPANIES.map((c) => {
            const Icon = companyIcons[c.id];
            return (
              <div key={c.id} className="mb-5 last:mb-0">
                <a
                  href={localizedHref(c.base, lang)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-ink">{t(`companies.${c.id}.name`)}</span>
                </a>
                <div className="mt-1 flex flex-col">
                  {c.nav.map((item) => (
                    <a
                      key={item.to}
                      href={localizedHref(item.to, lang)}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(item.to) ? 'page' : undefined}
                      className={clsx(
                        'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                        isActive(item.to) ? 'text-primary' : 'text-ink-600 hover:bg-ink/5',
                      )}
                    >
                      {t(`companies.${c.id}.nav.${item.key}`)}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="mt-5 flex flex-col gap-2 border-t border-ink-100 pt-4">
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

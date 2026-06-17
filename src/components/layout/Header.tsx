import { useState } from 'react';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';

const navItems = [
  { to: '/', key: 'home' },
  { to: '/about', key: 'about' },
  { to: '/services', key: 'services' },
  { to: '/logistics', key: 'logistics' },
  { to: '/gallery', key: 'gallery' },
  { to: '/team', key: 'team' },
  { to: '/contact', key: 'contact' },
];

interface Props {
  currentPath: string;
  lang: Lang;
}

export default function Header({ currentPath, lang }: Props) {
  const { t } = useLocale(lang);
  const [open, setOpen] = useState(false);

  // Navigation is now a full page load (no client-side router), so each
  // route change remounts Header fresh — no effect needed to reset `open`.
  const isActive = (to: string) => {
    const href = localizedHref(to, lang);
    return to === '/' ? currentPath === href : currentPath.startsWith(href);
  };

  // The alternate-language version of whatever page we're currently on —
  // a real crawlable link, not a client-side state toggle.
  const altHref =
    lang === 'ar' ? currentPath.replace(/^\/ar/, '') || '/' : localizedHref(currentPath, 'ar');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <a href={localizedHref('/', lang)} aria-label="Abu Sonbul home" className="flex-shrink-0">
          <img src="/assets/logo/main-logo.svg" alt="Abu Sonbul Transporters" className="h-10 w-auto object-contain" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.to}
              href={localizedHref(item.to, lang)}
              className={clsx(
                'rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap',
                isActive(item.to)
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-ink/75 hover:text-ink hover:bg-ink/6 active:bg-ink/10',
              )}
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <a
            href={altHref}
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
              'text-ink/60 hover:text-ink hover:bg-ink/6',
            )}
            aria-label="Switch language"
            hrefLang={lang === 'ar' ? 'en' : 'ar'}
          >
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span>{t('lang.switchTo')}</span>
          </a>
          <a href={localizedHref('/contact?subject=quote', lang)} className="btn-primary !py-2 !px-4 !text-sm">
            {t('nav.getQuote')}
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </a>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden rounded-full p-2 transition-colors text-ink hover:bg-ink/5"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          'lg:hidden overflow-y-auto transition-[max-height] duration-300 ease-in-out border-t bg-white',
          open ? 'max-h-[85dvh] border-ink-100' : 'max-h-0 border-transparent',
        )}
      >
        <nav className="container-page py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <a
              key={item.to}
              href={localizedHref(item.to, lang)}
              onClick={() => setOpen(false)}
              className={clsx(
                'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                isActive(item.to) ? 'bg-primary text-white' : 'text-ink hover:bg-ink/5',
              )}
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-ink-100">
            <a href={altHref} onClick={() => setOpen(false)} className="btn-outline" hrefLang={lang === 'ar' ? 'en' : 'ar'}>
              <Globe className="h-4 w-4" />
              {t('lang.switchTo')}
            </a>
            <a href={localizedHref('/contact?subject=quote', lang)} onClick={() => setOpen(false)} className="btn-primary">
              {t('nav.getQuote')}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

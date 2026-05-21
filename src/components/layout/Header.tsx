import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', key: 'home' },
  { to: '/about', key: 'about' },
  { to: '/services', key: 'services' },
  { to: '/logistics', key: 'logistics' },
  { to: '/gallery', key: 'gallery' },
  { to: '/team', key: 'team' },
  { to: '/contact', key: 'contact' },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="bg-white shadow-sm border-b border-ink-100">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" aria-label="Abu Sonbul home" className="flex-shrink-0">
          <img src="/assets/logo/main-logo.svg" alt="Abu Sonbul Transporters" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-ink/75 hover:text-ink hover:bg-ink/6 active:bg-ink/10',
                )
              }
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleLang}
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
              'text-ink/60 hover:text-ink hover:bg-ink/6',
            )}
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span>{t('lang.switchTo')}</span>
          </button>
          <Link to="/contact?subject=quote" className="btn-primary !py-2 !px-4 !text-sm">
            {t('nav.getQuote')}
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </Link>
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
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                  isActive ? 'bg-primary text-white' : 'text-ink hover:bg-ink/5',
                )
              }
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
          <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-ink-100">
            <button onClick={() => { toggleLang(); setOpen(false); }} className="btn-outline">
              <Globe className="h-4 w-4" />
              {t('lang.switchTo')}
            </button>
            <Link to="/contact?subject=quote" onClick={() => setOpen(false)} className="btn-primary">
              {t('nav.getQuote')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

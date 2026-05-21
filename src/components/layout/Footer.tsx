import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import LogoBrand from '../ui/LogoBrand';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      {/* Red top accent */}
      <div className="h-1 bg-primary w-full" />

      <div className="container-page pt-16 pb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="inline-flex">
            <LogoBrand className="brightness-0 invert" />
          </Link>
          <p className="mt-5 text-sm text-white/55 leading-relaxed max-w-xs">
            {t('footer.tagline')}
          </p>
          <Link
            to="/contact?subject=quote"
            className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-primary-300 hover:text-primary-200 transition-colors"
          >
            {t('nav.getQuote')}
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </Link>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40 mb-6">
            {t('footer.explore')}
          </h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="text-white/70 hover:text-primary-300 transition-colors">{t('nav.about')}</Link></li>
            <li><Link to="/team" className="text-white/70 hover:text-primary-300 transition-colors">{t('nav.team')}</Link></li>
            <li><Link to="/gallery" className="text-white/70 hover:text-primary-300 transition-colors">{t('nav.gallery')}</Link></li>
            <li><Link to="/contact" className="text-white/70 hover:text-primary-300 transition-colors">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40 mb-6">
            {t('footer.services')}
          </h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/services" className="text-white/70 hover:text-primary-300 transition-colors">{t('nav.services')}</Link></li>
            <li><Link to="/logistics" className="text-white/70 hover:text-primary-300 transition-colors">{t('nav.logistics')}</Link></li>
            <li><Link to="/services" className="text-white/70 hover:text-primary-300 transition-colors">{t('nav.equipment')}</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40 mb-6">
            {t('footer.contact')}
          </h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <span className="text-white/70">{t('contact.info.address')}</span>
            </li>
            <li>
              <a
                href="mailto:info@abusonbul-transporters.com"
                className="flex items-start gap-3 text-white/70 hover:text-primary-300 transition-colors"
              >
                <Mail className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="break-all">info@abusonbul-transporters.com</span>
              </a>
            </li>
            <li>
              <a href="tel:+962795700658" className="flex items-start gap-3 text-white/70 hover:text-primary-300 transition-colors">
                <Phone className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span dir="ltr">+962 79 570 0658</span>
              </a>
            </li>
            <li>
              <a href="tel:+962799128641" className="flex items-start gap-3 text-white/70 hover:text-primary-300 transition-colors">
                <Phone className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span dir="ltr">+962 79 912 8641</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <p>© {year} {t('brand.full')}. {t('footer.rights')}</p>
          <p className="text-white/25">{t('brand.tagline')}</p>
        </div>
      </div>
    </footer>
  );
}

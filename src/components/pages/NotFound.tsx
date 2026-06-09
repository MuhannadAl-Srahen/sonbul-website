import { ArrowRight } from 'lucide-react';
import { useLocale } from '../../i18n';
import type { Lang } from '../../i18n';

interface Props {
  lang: Lang;
}

export default function NotFound({ lang }: Props) {
  const { t } = useLocale(lang);
  return (
    <section className="section">
      <div className="container-page text-center max-w-xl mx-auto">
        <div className="text-7xl md:text-8xl font-display font-bold text-primary">404</div>
        <h1 className="heading-lg mt-4">Page not found</h1>
        <p className="lead mt-3">The page you're looking for doesn't exist or was moved.</p>
        <a href="/" className="btn-primary mt-8">
          {t('nav.home')}
          <ArrowRight className="h-4 w-4 rtl-flip" />
        </a>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <section className="section">
      <div className="container-page text-center max-w-xl mx-auto">
        <div className="text-7xl md:text-8xl font-display font-bold text-primary">404</div>
        <h1 className="heading-lg mt-4">Page not found</h1>
        <p className="lead mt-3">The page you're looking for doesn't exist or was moved.</p>
        <Link to="/" className="btn-primary mt-8">
          {t('nav.home')}
          <ArrowRight className="h-4 w-4 rtl-flip" />
        </Link>
      </div>
    </section>
  );
}

import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface Props {
  title: string;
  description?: string;
}

const SITE_URL = 'https://www.abusonbul-transporters.com';

export default function SEO({ title, description }: Props) {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const fullTitle = `${title} — Abu Sonbul Arab Transporters`;
  const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`;
  return (
    <Helmet>
      <html lang={i18n.language} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
    </Helmet>
  );
}

import { ArrowRight } from 'lucide-react';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { COMPANIES } from '../../data/companies';
import { companyIcons } from '../ui/companyIcons';

interface Props {
  lang: Lang;
}

export default function NotFound({ lang }: Props) {
  const { t } = useLocale(lang);
  const href = (path: string) => localizedHref(path, lang);

  return (
    <section className="section pt-32">
      <div className="container-page mx-auto max-w-3xl text-center">
        <div className="font-display text-7xl font-bold text-primary md:text-8xl">404</div>
        <h1 className="heading-lg mt-4">{t('notFound.title')}</h1>
        <p className="lead mt-3">{t('notFound.body')}</p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {COMPANIES.map((c) => {
            const Icon = companyIcons[c.id];
            return (
              <a
                key={c.id}
                href={href(c.base)}
                className="card group p-6 text-start transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-base font-bold text-ink">{t(`companies.${c.id}.name`)}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  {t(`companies.${c.id}.tagline`)}
                </p>
              </a>
            );
          })}
        </div>

        <a href={href('/')} className="btn-outline mt-10">
          {t('notFound.home')}
          <ArrowRight className="h-4 w-4 rtl-flip" />
        </a>
      </div>
    </section>
  );
}

import { ArrowRight, Container, HardHat, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import CTABand from '../sections/CTABand';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { COMPANIES, type CompanyId } from '../../data/companies';
import { companyChrome, serviceKeys } from './companyChrome';

const companyIcons: Record<CompanyId, LucideIcon> = {
  transport: Truck,
  'project-services': HardHat,
  logistics: Container,
};

interface Props {
  lang: Lang;
}

/**
 * The group-level service index.
 *
 * Grouped by the company that delivers each service rather than presented as one flat
 * list — that is the whole point of the split, and it gives every service a single
 * onward destination instead of pointing everything at the same page.
 */
export default function Services({ lang }: Props) {
  const { t } = useLocale(lang);
  const href = (path: string) => localizedHref(path, lang);

  return (
    <>
      <PageHero
        eyebrow={t('services.hero.eyebrow')}
        title={t('services.hero.title')}
        subtitle={t('services.hero.subtitle')}
      />

      {COMPANIES.map((c, ci) => {
        const chrome = companyChrome[c.id];
        const CompanyIcon = companyIcons[c.id];
        return (
          <section key={c.id} className={ci % 2 === 0 ? 'section bg-white' : `section ${chrome.surface}`}>
            <div className="container-page">
              <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <span className="eyebrow">
                    <CompanyIcon className="h-3.5 w-3.5" />
                    {t(`companies.${c.id}.short`)}
                  </span>
                  <h2 className="heading-lg mt-3">{t(`companies.${c.id}.name`)}</h2>
                  <p className="lead mt-4">{t(`companies.${c.id}.tagline`)}</p>
                </div>
                <a href={href(c.base)} className="btn-outline shrink-0">
                  {t('common.knowMore')}
                  <ArrowRight className="h-4 w-4 rtl-flip" />
                </a>
              </Reveal>

              <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {serviceKeys[c.id].map((key, i) => {
                  const Icon = chrome.serviceIcons[key];
                  return (
                    <Reveal key={key} delay={i * 0.05}>
                      <div className="flex gap-4">
                        <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </span>
                        <div>
                          <h3 className="font-bold text-ink">
                            {t(`${c.i18nKey}.services.items.${key}.title`)}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                            {t(`${c.i18nKey}.services.items.${key}.short`)}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              <Reveal delay={0.2}>
                <a
                  href={href(`${c.base}/services`)}
                  className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
                >
                  {t('services.allFrom')} {t(`companies.${c.id}.short`)}
                  <ArrowRight className="h-4 w-4 rtl-flip" />
                </a>
              </Reveal>
            </div>
          </section>
        );
      })}

      <CTABand
        title={t('group.cta.title')}
        subtitle={t('group.cta.subtitle')}
        cta={{ label: t('group.cta.button'), href: href('/contact') }}
      />
    </>
  );
}

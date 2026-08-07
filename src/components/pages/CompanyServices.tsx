import { ArrowRight } from 'lucide-react';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { COMPANY_BY_ID, type CompanyId } from '../../data/companies';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import PhotoStrip from '../sections/PhotoStrip';
import CTABand from '../sections/CTABand';
import { companyChrome, serviceKeys } from './companyChrome';

interface Props {
  company: CompanyId;
  lang: Lang;
}

/** The full service list for one company: the same shape for all three. */
export default function CompanyServices({ company, lang }: Props) {
  const { t } = useLocale(lang);
  const c = COMPANY_BY_ID[company];
  const ns = c.i18nKey;
  const chrome = companyChrome[company];
  const href = (path: string) => localizedHref(path, lang);

  return (
    <>
      <PageHero
        eyebrow={t(`companies.${company}.short`)}
        title={t(`${ns}.services.title`)}
        subtitle={t(`${ns}.services.subtitle`)}
        image={chrome.hero}
        overlay={chrome.overlay}
        texture={chrome.texture}
      />

      <section className="section bg-white">
        <div className="container-page grid gap-x-12 gap-y-14 md:grid-cols-2">
          {serviceKeys[company].map((key, i) => {
            const Icon = chrome.serviceIcons[key];
            return (
              <Reveal key={key} delay={i * 0.06}>
                <div className="flex gap-5">
                  <span className="inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-7 w-7" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-ink">
                      {t(`${ns}.services.items.${key}.title`)}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-primary">
                      {t(`${ns}.services.items.${key}.short`)}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-500">
                      {t(`${ns}.services.items.${key}.body`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className={`section-tight ${chrome.surface}`}>
        <div className="container-page">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <span className="eyebrow justify-center">{t(`${ns}.gallery.eyebrow`)}</span>
            <h2 className="heading-lg mt-3">{t(`${ns}.gallery.title`)}</h2>
          </Reveal>
          <PhotoStrip
            query={chrome.photos}
            lang={lang}
            altPrefix={t(`companies.${company}.name`)}
            seeAllLabel={t(`${ns}.gallery.seeAll`)}
            seeAllHref={`${href('/')}?company=${company}#gallery`}
          />
        </div>
      </section>

      <CTABand
        title={t(`${ns}.cta.title`)}
        subtitle={t(`${ns}.cta.subtitle`)}
        cta={{
          label: t(`${ns}.cta.button`),
          href: `${href('/')}#contact`,
        }}
      />

      <div className="container-page pb-16">
        <a
          href={href(c.base)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
        >
          <ArrowRight className="h-4 w-4 rotate-180 rtl-flip" />
          {t(`companies.${company}.nav.overview`)}
        </a>
      </div>
    </>
  );
}

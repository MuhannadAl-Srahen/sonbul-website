import { ArrowRight } from 'lucide-react';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { COMPANY_BY_ID, type CompanyId } from '../../data/companies';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import PhotoStrip from '../sections/PhotoStrip';
import CTABand from '../sections/CTABand';
import EyebrowRule from '../ui/EyebrowRule';
import { companyChrome, getSection } from './companyChrome';

interface Props {
  company: CompanyId;
  section: string;
  lang: Lang;
}

/**
 * One deep-dive page behind a company's "Know more" link: fleet, routes, cargo, camps,
 * catering, equipment or customs.
 *
 * Seven pages, one component: they differ only in which copy subtree they read and which
 * photos they pull, both of which come from COMPANY_SECTIONS.
 */
export default function CompanySection({ company, section, lang }: Props) {
  const { t } = useLocale(lang);
  const c = COMPANY_BY_ID[company];
  const chrome = companyChrome[company];
  const meta = getSection(company, section);
  if (!meta) return null;

  const ns = `${c.i18nKey}.sections.${section}`;
  const href = (path: string) => localizedHref(path, lang);

  return (
    <>
      <PageHero
        eyebrow={t(`${ns}.eyebrow`)}
        title={t(`${ns}.title`)}
        subtitle={t(`${ns}.subtitle`)}
        image={chrome.hero}
        overlay={chrome.overlay}
        texture={chrome.texture}
        rule={<EyebrowRule company={company} />}
      />

      <section className="section bg-white">
        <div className="container-page">
          <Reveal className="max-w-3xl">
            <p className="lead">{t(`${ns}.intro`)}</p>
          </Reveal>

          <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {meta.items.map((key, i) => (
              <Reveal key={key} delay={i * 0.05}>
                <div className="border-s-2 border-primary/20 ps-6">
                  <span className="text-xs font-bold tabular-nums text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="mt-2 text-xl font-bold text-ink">
                    {t(`${ns}.items.${key}.title`)}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-500">
                    {t(`${ns}.items.${key}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`section-tight ${chrome.surface}`}>
        <div className="container-page">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <span className="eyebrow justify-center">{t(`${c.i18nKey}.gallery.eyebrow`)}</span>
            <h2 className="heading-lg mt-3">{t(`${ns}.eyebrow`)}</h2>
          </Reveal>
          <PhotoStrip
            query={{ ...chrome.photos, tags: meta.tags, match: 'any' }}
            lang={lang}
            altPrefix={t(`companies.${company}.name`)}
            seeAllLabel={t(`${c.i18nKey}.gallery.seeAll`)}
            seeAllHref={`${href('/')}?company=${company}#gallery`}
          />
        </div>
      </section>

      <CTABand
        title={t(`${c.i18nKey}.cta.title`)}
        subtitle={t(`${c.i18nKey}.cta.subtitle`)}
        cta={{
          label: t(`${c.i18nKey}.cta.button`),
          href: `${href('/')}#contact`,
        }}
      />

      <div className="container-page pb-16">
        <a
          href={href(c.base)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
        >
          <ArrowRight className="h-4 w-4 rotate-180 rtl-flip" />
          {t(`companies.${company}.name`)}
        </a>
      </div>
    </>
  );
}

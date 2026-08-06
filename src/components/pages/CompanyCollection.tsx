import { ArrowRight } from 'lucide-react';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { COMPANY_BY_ID, type CompanyId } from '../../data/companies';
import { PROJECTS } from '../../data/projects';
import { CROSSINGS } from '../../data/crossings';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import CTABand from '../sections/CTABand';
import { companyChrome } from './companyChrome';
import EyebrowRule from '../ui/EyebrowRule';

type Collection = 'projects' | 'crossings';

const owner: Record<Collection, CompanyId> = {
  projects: 'project-services',
  crossings: 'logistics',
};

interface Props {
  collection: Collection;
  lang: Lang;
}

/** Index page for a company's projects or border crossings. */
export default function CompanyCollection({ collection, lang }: Props) {
  const { t } = useLocale(lang);
  const company = owner[collection];
  const c = COMPANY_BY_ID[company];
  const ns = c.i18nKey;
  const chrome = companyChrome[company];
  const href = (path: string) => localizedHref(path, lang);

  const entries =
    collection === 'projects'
      ? PROJECTS.map((p) => ({ slug: p.slug, key: p.key }))
      : CROSSINGS.map((cr) => ({ slug: cr.slug, key: cr.key }));

  return (
    <>
      <PageHero
        eyebrow={t(`${ns}.${collection}.eyebrow`)}
        title={t(`${ns}.${collection}.title`)}
        subtitle={t(`${ns}.${collection}.subtitle`)}
        image={chrome.hero}
        overlay={chrome.overlay}
        texture={chrome.texture}
        rule={<EyebrowRule company={company} />}
      />

      <section className="section bg-white">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {entries.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.08}>
              <a href={href(`${c.base}/${collection}/${e.slug}`)} className="card group block h-full p-8">
                <span className="eyebrow">
                  {t(
                    collection === 'projects'
                      ? `${ns}.projects.items.${e.key}.meta`
                      : `${ns}.crossings.items.${e.key}.corridor`,
                  )}
                </span>
                <h2 className="mt-3 text-2xl font-bold text-ink">
                  {t(`${ns}.${collection}.items.${e.key}.name`)}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {t(`${ns}.${collection}.items.${e.key}.short`)}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                  {t('common.knowMore')}
                  <ArrowRight className="h-4 w-4 rtl-flip" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABand
        title={t(`${ns}.cta.title`)}
        subtitle={t(`${ns}.cta.subtitle`)}
        cta={{
          label: t(`${ns}.cta.button`),
          href: href(`/contact?subject=quote&company=${company}`),
        }}
      />
    </>
  );
}

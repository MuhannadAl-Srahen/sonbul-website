import { ShieldCheck } from 'lucide-react';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import SectionHeader from '../sections/SectionHeader';
import CTABand from '../sections/CTABand';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';

interface Props {
  lang: Lang;
}

/**
 * The group's safety page.
 *
 * Group-level rather than filed under project services, because the same standard covers
 * a loaded trailer, a camp kitchen and a border yard, and the crews are the same people.
 * The thirteen provisions are the client's own wording, kept as one numbered list because
 * that is how a reader checks whether the thing they care about is covered.
 */
const PROVISIONS = [
  'supervision',
  'compliance',
  'ppe',
  'inspections',
  'hazards',
  'fire',
  'emergency',
  'handling',
  'vehicles',
  'reporting',
  'training',
  'coordination',
  'environment',
] as const;

export default function Safety({ lang }: Props) {
  const { t } = useLocale(lang);
  const href = (path: string) => localizedHref(path, lang);

  return (
    <>
      <PageHero
        eyebrow={t('safety.hero.eyebrow')}
        title={t('safety.hero.title')}
        subtitle={t('safety.hero.subtitle')}
        image="/assets/gallery/camps/camps-01.webp"
        overlay="lift"
      />

      <section className="section bg-white">
        <div className="container-page">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow justify-center">
              <ShieldCheck className="h-4 w-4" />
              {t('safety.provisions.eyebrow')}
            </span>
            <h2 className="heading-lg mt-3">{t('safety.intro.title')}</h2>
            <p className="lead mt-4">{t('safety.intro.body')}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-tight bg-sand">
        <div className="container-page">
          <SectionHeader title={t('safety.provisions.title')} className="mb-12" />
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
            {PROVISIONS.map((key, i) => (
              <Reveal key={key} delay={i * 0.04}>
                <div className="card flex h-full items-start gap-4 p-6">
                  {/* Numbered rather than ticked: this is a list of duties being carried
                      out, not a list of claims being made. */}
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white tabular-nums">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink-700">
                    {t(`safety.provisions.items.${key}`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title={t('safety.cta.title')}
        subtitle={t('safety.cta.subtitle')}
        cta={{ label: t('safety.cta.button'), href: `${href('/')}#contact` }}
      />
    </>
  );
}

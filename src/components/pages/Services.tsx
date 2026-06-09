import {
  Truck,
  PackageSearch,
  Wrench,
  Building2,
  UtensilsCrossed,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';

const services = [
  { key: 'transport', icon: Truck, to: '/services' },
  { key: 'logistics', icon: PackageSearch, to: '/logistics' },
  { key: 'equipment', icon: Wrench, to: '/services' },
  { key: 'camp', icon: Building2, to: '/services' },
  { key: 'catering', icon: UtensilsCrossed, to: '/services' },
  { key: 'operations', icon: ClipboardList, to: '/services' },
] as const;

interface Props {
  lang: Lang;
}

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

      <section className="section">
        <div className="container-page">
          <Reveal className="max-w-2xl mb-12">
            <span className="eyebrow">{t('services.hero.eyebrow')}</span>
            <h2 className="heading-lg mt-3">{t('services.hero.title')}</h2>
            <p className="lead mt-4">{t('services.hero.subtitle')}</p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.06}>
              <article className="card p-8 h-full flex flex-col hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">{t(`services.items.${s.key}.title`)}</h3>
                <p className="mt-3 text-ink-500 leading-relaxed">
                  {t(`services.items.${s.key}.body`)}
                </p>
                <div className="mt-6">
                  <a
                    href={href('/contact')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                  >
                    {t('nav.contact')}
                    <ArrowRight className="h-4 w-4 rtl-flip" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight bg-sand">
        <div className="container-page text-center max-w-2xl mx-auto">
          <Reveal>
            <h2 className="heading-lg">{t('home.cta.title')}</h2>
            <p className="lead mt-4">{t('home.cta.subtitle')}</p>
            <a href={href('/contact')} className="btn-primary mt-8">
              {t('home.cta.button')}
              <ArrowRight className="h-4 w-4 rtl-flip" />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

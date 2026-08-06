import { ArrowRight, CheckCircle2, Handshake, HardHat, ShieldCheck, Sparkles } from 'lucide-react';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { COMPANIES } from '../../data/companies';
import { companyIcons } from '../ui/companyIcons';

const valueIcons = {
  integrity: ShieldCheck,
  safety: HardHat,
  excellence: Sparkles,
  partnership: Handshake,
} as const;

interface Props {
  lang: Lang;
}

export default function About({ lang }: Props) {
  const { t } = useLocale(lang);
  const href = (path: string) => localizedHref(path, lang);
  const founderPoints = t('about.founder.points', { returnObjects: true }) as string[];

  return (
    <>
      <PageHero
        eyebrow={t('about.hero.eyebrow')}
        title={t('about.hero.title')}
        subtitle={t('about.hero.subtitle')}
      />

      {/* Story */}
      <section className="section">
        <div className="container-page grid lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow">{t('about.story.eyebrow')}</span>
            <h2 className="heading-lg mt-3">{t('about.story.title')}</h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <p className="lead">{t('about.story.body')}</p>
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {(t('about.story.stats', { returnObjects: true }) as { k: string; v: string }[]).map((b) => (
                <div key={b.k} className="border-s-2 border-primary ps-4">
                  <div className="text-2xl font-bold text-primary">{b.k}</div>
                  <div className="text-sm text-ink-500 mt-1">{b.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Group structure — the three companies, stated plainly */}
      <section className="section bg-ink text-white">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <span className="eyebrow !text-primary-300">{t('about.companies.eyebrow')}</span>
            <h2 className="heading-lg !text-white mt-3">{t('about.companies.title')}</h2>
            <p className="lead !text-white/60 mt-4">{t('about.companies.subtitle')}</p>
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {COMPANIES.map((c, i) => {
              const Icon = companyIcons[c.id];
              return (
                <Reveal key={c.id} delay={i * 0.08}>
                  <a
                    href={href(c.base)}
                    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-7 transition-colors duration-300 hover:border-primary/50 hover:bg-white/10"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-white">
                      {t(`companies.${c.id}.name`)}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                      {t(`companies.${c.id}.tagline`)}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-300 transition-all group-hover:gap-3">
                      {t('common.knowMore')}
                      <ArrowRight className="h-4 w-4 rtl-flip" />
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="section bg-sand">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="aspect-[4/3] sm:aspect-[4/5] overflow-hidden rounded-3xl shadow-soft">
              <img
                src="/assets/people/raed-abu-sonbul.webp"
                alt={t('about.founder.name')}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <span className="eyebrow">{t('about.founder.eyebrow')}</span>
              <h2 className="heading-lg mt-3">{t('about.founder.name')}</h2>
              <div className="mt-2 h-1 w-14 bg-primary rounded-full" />
            </Reveal>
            <ul className="mt-8 space-y-4">
              {founderPoints.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-ink-700 leading-relaxed">{p}</span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.2}>
              <figure className="mt-10">
                <video
                  controls
                  playsInline
                  preload="none"
                  poster="/assets/video/founder-message-poster.webp"
                  className="w-full rounded-2xl shadow-soft bg-ink"
                >
                  <source src="/assets/video/founder-message.mp4" type="video/mp4" />
                </video>
                <figcaption className="mt-3 text-sm text-ink-500">
                  {t('about.founder.videoCaption')}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">{t('about.values.eyebrow')}</span>
            <h2 className="heading-lg mt-3">{t('about.values.title')}</h2>
            <p className="lead mt-4">{t('about.values.subtitle')}</p>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(Object.keys(valueIcons) as Array<keyof typeof valueIcons>).map((k, i) => {
              const Icon = valueIcons[k];
              return (
                <Reveal key={k} delay={i * 0.08}>
                  <div className="card p-7 h-full hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
                    <Icon className="h-8 w-8 text-primary" />
                    <h3 className="mt-5 font-semibold text-lg">{t(`about.values.items.${k}.title`)}</h3>
                    <p className="mt-2 text-sm text-ink-500 leading-relaxed">
                      {t(`about.values.items.${k}.body`)}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

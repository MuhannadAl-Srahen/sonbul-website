import { useState } from 'react';
import { ArrowRight, Award, CheckCircle2, Globe2, Layers, Play, Quote, Users } from 'lucide-react';
import Reveal from '../ui/Reveal';
import ClientSlider from '../ui/ClientSlider';
import StatStrip, { type Stat } from '../sections/StatStrip';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { COMPANIES } from '../../data/companies';
import { companyChrome } from './companyChrome';
import AboutSection from '../sections/AboutSection';
import TeamSection from '../sections/TeamSection';
import GallerySection from '../sections/GallerySection';
import ContactSection from '../sections/ContactSection';
import { companyIcons } from '../ui/companyIcons';

const whyIcons = {
  experience: Award,
  integrated: Layers,
  regional: Globe2,
  people: Users,
} as const;

interface Props {
  lang: Lang;
}

/**
 * The group hub.
 *
 * Deliberately a full landing page rather than a "pick a company" doorway: it carries
 * the group's own hero, stats, story and proof, so it stands on its own in search
 * instead of being a thin gateway that hands all its authority to three child pages.
 */
export default function GroupHome({ lang }: Props) {
  const { t } = useLocale(lang);
  const href = (path: string) => localizedHref(path, lang);
  const [playing, setPlaying] = useState(false);

  const stats: Stat[] = [
    { end: 18, suffix: '+', label: t('group.stats.years') },
    { end: 25, suffix: '+', label: t('group.stats.projects') },
    { end: 40, suffix: '+', label: t('group.stats.clients') },
    { end: 80, suffix: '+', label: t('group.stats.team') },
  ];

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO — full-screen, transparent header overlay
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden -mt-20 min-h-screen flex flex-col bg-ink">
        <div className="absolute inset-0">
          <img
            src="/assets/hero/hero.jpg"
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="high"
            /* No `hero-img`: that class mirrors the photo in RTL, and this one carries the
               company's own name on the cab door and bumper. */
            className="h-full w-full object-cover object-right-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-ink via-ink/90 to-ink/20" />
          <div className="absolute inset-y-0 start-0 w-2/3 bg-gradient-to-r rtl:bg-gradient-to-l from-ink/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
          <div className="absolute inset-0 grain opacity-15" aria-hidden />
        </div>

        <div className="relative flex-1 container-page flex flex-col justify-center pt-28 sm:pt-36 pb-8">
          <div className="animate-fade-in-up-hero max-w-3xl">
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-primary-200 mb-6 hero-text-shadow">
              <span className="h-[2px] w-8 bg-primary inline-block" />
              {t('group.hero.eyebrow')}
            </span>
            <h1 className="home-hero-title text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight hero-text-shadow">
              {t('group.hero.title')}
            </h1>
            <p className="mt-7 text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed hero-text-shadow">
              {t('group.hero.subtitle')}
            </p>
            <div className="mt-11 flex flex-wrap gap-4">
              <a
                href={`${href('/')}#contact`}
                className="btn bg-primary text-white hover:bg-primary-600 shadow-lg hover:shadow-xl active:scale-[0.98] !px-8 !py-4 !text-base"
              >
                {t('group.hero.ctaPrimary')}
                <ArrowRight className="h-5 w-5 rtl-flip" />
              </a>
              <a
                href="#companies"
                className="btn border-2 border-white/30 text-white hover:bg-white hover:text-ink hover:border-white !px-8 !py-4 !text-base transition-all duration-200"
              >
                {t('group.hero.ctaSecondary')}
              </a>
            </div>
          </div>
        </div>

        <StatStrip items={stats} className="relative" />
      </section>

      {/* ══════════════════════════════════════════
          COMPANIES — the group's reason to exist
      ══════════════════════════════════════════ */}
      <section id="companies" className="section bg-white scroll-mt-20">
        <div className="container-page">
          <Reveal className="max-w-2xl mb-14">
            <span className="eyebrow">{t('group.companies.eyebrow')}</span>
            <h2 className="heading-lg mt-3">{t('group.companies.title')}</h2>
            <p className="lead mt-4">{t('group.companies.subtitle')}</p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {COMPANIES.map((c, i) => {
              const Icon = companyIcons[c.id];
              return (
                <Reveal key={c.id} delay={i * 0.08}>
                  <a
                    href={href(c.base)}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                      <img
                        src={companyChrome[c.id].hero}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
                      <span className="absolute bottom-4 start-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
                        <Icon className="h-6 w-6" />
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-7">
                      <h3 className="text-xl font-bold text-ink">{t(`companies.${c.id}.name`)}</h3>
                      <p className="mt-1.5 text-sm font-medium text-primary">
                        {t(`companies.${c.id}.tagline`)}
                      </p>
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-500">
                        {t(`group.companies.items.${c.id}.body`)}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                        {t('common.knowMore')}
                        <ArrowRight className="h-4 w-4 rtl-flip" />
                      </span>
                    </div>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY US — dark bg, image + feature list
      ══════════════════════════════════════════ */}
      <section className="section bg-ink text-white">
        <div className="container-page grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden rounded-2xl shadow-soft">
                <img
                  src="/assets/gallery/home-image.jpg"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              </div>
              <div className="absolute -bottom-5 -end-5 hidden md:flex flex-col bg-primary text-white px-8 py-6 shadow-2xl rounded-xl">
                <span className="text-4xl font-bold leading-none">18+</span>
                <span className="text-sm text-white/80 mt-1">{t('group.stats.years')}</span>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="eyebrow !text-primary-300">{t('group.why.eyebrow')}</span>
              <h2 className="heading-lg !text-white mt-3">{t('group.why.title')}</h2>
            </Reveal>
            <div className="mt-10 space-y-0">
              {(Object.keys(whyIcons) as Array<keyof typeof whyIcons>).map((key, i) => {
                const Icon = whyIcons[key];
                return (
                  <Reveal key={key} delay={i * 0.08}>
                    <div className="flex gap-5 py-6 border-b border-white/10 last:border-0">
                      <div className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">
                          {t(`group.why.items.${key}.title`)}
                        </h3>
                        <p className="mt-1 text-sm text-white/60 leading-relaxed">
                          {t(`group.why.items.${key}.body`)}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <Reveal delay={0.35}>
              <a
                href={`${href('/')}#about`}
                className="btn bg-white text-ink hover:bg-primary hover:text-white mt-8"
              >
                {t('nav.about')}
                <ArrowRight className="h-4 w-4 rtl-flip" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VIDEO — founder's word
      ══════════════════════════════════════════ */}
      <section className="relative section bg-ink text-white overflow-hidden">
        <div className="absolute inset-0 grain opacity-10 pointer-events-none" aria-hidden />
        <div
          className="absolute -top-24 -start-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -bottom-24 -end-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"
          aria-hidden
        />

        <div className="relative container-page">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow !text-primary-300">
              <Quote className="h-3.5 w-3.5" />
              {t('group.video.eyebrow')}
            </span>
            <h2 className="heading-lg !text-white mt-3">{t('group.video.title')}</h2>
            <p className="lead !text-white/60 mt-4">{t('group.video.subtitle')}</p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                {playing ? (
                  <iframe
                    src="https://www.youtube.com/embed/dCpD5pqCINY?autoplay=1&rel=0&modestbranding=1"
                    title={t('group.video.title')}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <>
                    <img
                      src="https://img.youtube.com/vi/dCpD5pqCINY/maxresdefault.jpg"
                      alt={t('group.video.title')}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-ink/50" />
                    <button
                      onClick={() => setPlaying(true)}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-5 group"
                      aria-label={t('group.video.play')}
                    >
                      <div className="relative flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary shadow-2xl group-hover:scale-110 group-hover:bg-primary-600 transition-all duration-300">
                        <Play className="h-9 w-9 sm:h-11 sm:w-11 text-white fill-white ms-1" />
                        <span className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping" />
                      </div>
                      <span className="text-white font-semibold text-sm sm:text-base tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
                        {t('group.video.play')}
                      </span>
                    </button>
                  </>
                )}
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 text-white/60 text-sm">
                <span className="h-px w-8 bg-primary inline-block" />
                <span>{t('group.video.attribution')}</span>
                <span className="h-px w-8 bg-primary inline-block" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CLIENTS — draggable logo strip
      ══════════════════════════════════════════ */}
      <section className="section-tight bg-white border-y border-ink-100">
        <div className="container-page text-center mb-10">
          <Reveal>
            <span className="eyebrow justify-center">{t('group.clients.eyebrow')}</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3 text-ink">
              {t('group.clients.title')}
            </h2>
          </Reveal>
        </div>
        {/* Full-bleed: the strip runs off both edges rather than being masked to
            transparent, which read as a grey smear over a light section. */}
        <ClientSlider />
      </section>

      {/* The standalone /about, /team, /gallery and /contact pages were folded into this
          one, so the landing page is now the whole group story end to end. */}
      <AboutSection lang={lang} />
      <TeamSection lang={lang} />
      <GallerySection lang={lang} />
      <ContactSection lang={lang} />

      {/* ══════════════════════════════════════════
          CTA — dark box with red accent
      ══════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden bg-ink rounded-2xl px-8 py-16 md:px-16 md:py-20 text-white">
              <div className="absolute start-0 top-0 bottom-0 w-1.5 bg-primary rounded-s-2xl" />
              <div
                className="absolute -top-16 -end-16 h-80 w-80 rounded-full bg-primary/15 blur-3xl pointer-events-none"
                aria-hidden
              />
              <div
                className="absolute bottom-0 end-32 h-48 w-48 rounded-full bg-primary/10 blur-2xl pointer-events-none"
                aria-hidden
              />

              <div className="relative max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-300">
                    {t('group.why.badge')}
                  </span>
                </div>
                <h2 className="heading-lg !text-white">{t('group.cta.title')}</h2>
                <p className="mt-4 text-white/65 text-lg leading-relaxed">
                  {t('group.cta.subtitle')}
                </p>
                <a
                  href={`${href('/')}#contact`}
                  className="btn bg-primary text-white hover:bg-primary-600 shadow-lg hover:shadow-xl mt-8 !px-8 !py-4 !text-base active:scale-[0.98]"
                >
                  {t('group.cta.button')}
                  <ArrowRight className="h-5 w-5 rtl-flip" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

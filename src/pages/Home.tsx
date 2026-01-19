import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  ArrowRight,
  Truck,
  PackageSearch,
  Wrench,
  Building2,
  UtensilsCrossed,
  ClipboardList,
  Globe2,
  Award,
  Layers,
  CheckCircle2,
  Play,
  Quote,
} from 'lucide-react';
import SEO from '../components/util/SEO';
import Reveal from '../components/ui/Reveal';
import StatCounter from '../components/ui/StatCounter';
import ClientSlider from '../components/ui/ClientSlider';

const serviceIcons = {
  transport: Truck,
  logistics: PackageSearch,
  equipment: Wrench,
  camp: Building2,
  catering: UtensilsCrossed,
  operations: ClipboardList,
} as const;

const whyIcons = {
  experience: Award,
  reach: Globe2,
  fleet: Wrench,
  endToEnd: Layers,
} as const;

export default function Home() {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <SEO title={t('nav.home')} description={t('home.hero.subtitle')} />

      {/* ══════════════════════════════════════════
          HERO — full-screen, transparent header overlay
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden -mt-20 min-h-screen flex flex-col bg-ink">
        {/* Background image + overlay */}
        <div className="absolute inset-0">
          <img
            src="/assets/hero/hero.png"
            alt=""
            loading="eager"
            className="h-full w-full object-cover object-right-bottom hero-img"
          />
          {/* Strong left overlay so text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-ink via-ink/90 to-ink/20" />
          {/* Extra dark band for the text area */}
          <div className="absolute inset-y-0 start-0 w-2/3 bg-gradient-to-r rtl:bg-gradient-to-l from-ink/60 to-transparent pointer-events-none" />
          {/* Top gradient for nav */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
          <div className="absolute inset-0 grain opacity-15" aria-hidden />
        </div>

        {/* Hero content */}
        <div className="relative flex-1 container-page flex flex-col justify-center pt-28 sm:pt-36 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-primary-200 mb-6 hero-text-shadow">
              <span className="h-[2px] w-8 bg-primary inline-block" />
              {t('home.hero.eyebrow')}
            </span>
            <h1 className="home-hero-title text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight hero-text-shadow">
              {t('home.hero.title')}
            </h1>
            <p className="mt-7 text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed hero-text-shadow">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-11 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="btn bg-primary text-white hover:bg-primary-600 shadow-lg hover:shadow-xl active:scale-[0.98] !px-8 !py-4 !text-base"
              >
                {t('home.hero.ctaPrimary')}
                <ArrowRight className="h-5 w-5 rtl-flip" />
              </Link>
              <Link
                to="/services"
                className="btn border-2 border-white/30 text-white hover:bg-white hover:text-ink hover:border-white !px-8 !py-4 !text-base transition-all duration-200"
              >
                {t('home.hero.ctaSecondary')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats strip anchored to bottom */}
        <div className="relative bg-primary/95 backdrop-blur-sm text-white">
          <div className="container-page grid grid-cols-2 md:grid-cols-4">
            {[
              { end: 17, suffix: '+', label: t('home.stats.years') },
              { end: 25, suffix: '+', label: t('home.stats.projects') },
              { end: 40, suffix: '+', label: t('home.stats.clients') },
              { end: 80, suffix: '+', label: t('home.stats.team') },
            ].map((s, i) => (
              <Reveal
                key={i}
                delay={0.3 + i * 0.08}
                className={clsx(
                  'text-center px-4 py-6',
                  i === 0 && 'border-e border-b border-white/20 md:border-b-0',
                  i === 1 && 'border-b border-white/20 md:border-e md:border-b-0',
                  i === 2 && 'border-e border-white/20',
                )}
              >
                <div className="text-3xl md:text-4xl font-bold tabular-nums">
                  <StatCounter end={s.end} suffix={s.suffix} />
                </div>
                <p className="mt-1 text-xs text-white/75 uppercase tracking-wider">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SERVICES — mosaic hover grid
      ══════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <Reveal className="max-w-2xl">
              <span className="eyebrow">{t('home.services.eyebrow')}</span>
              <h2 className="heading-lg mt-3">{t('home.services.title')}</h2>
              <p className="lead mt-4">{t('home.services.subtitle')}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link to="/services" className="btn-outline shrink-0">
                {t('home.services.viewAll')}
                <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
            </Reveal>
          </div>

          {/* gap-px mosaic */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-100 border border-ink-100 rounded-xl overflow-hidden">
            {(Object.keys(serviceIcons) as Array<keyof typeof serviceIcons>).map((key, i) => {
              const Icon = serviceIcons[key];
              return (
                <Reveal key={key} delay={i * 0.06}>
                  <Link
                    to={key === 'logistics' ? '/logistics' : '/services'}
                    className="group relative block bg-white p-8 hover:bg-primary transition-colors duration-300 h-full"
                  >
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary group-hover:bg-white/15 group-hover:text-white transition-colors">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-ink group-hover:text-white transition-colors">
                      {t(`services.items.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-ink-500 group-hover:text-white/75 leading-relaxed transition-colors">
                      {t(`services.items.${key}.short`)}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-primary text-sm font-semibold group-hover:text-white transition-colors">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {t('home.services.viewAll')}
                      </span>
                      <ArrowRight className="h-4 w-4 rtl-flip group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
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
          {/* Image side */}
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden rounded-2xl shadow-soft">
                <img
                  src="/assets/gallery/home-image.jpg"
                  alt="Heavy equipment fleet"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              </div>
              {/* Floating accent badge */}
              <div className="absolute -bottom-5 -end-5 hidden md:flex flex-col bg-primary text-white px-8 py-6 shadow-2xl rounded-xl">
                <span className="text-4xl font-bold leading-none">17+</span>
                <span className="text-sm text-white/80 mt-1">{t('home.stats.years')}</span>
              </div>
            </div>
          </Reveal>

          {/* Content side */}
          <div>
            <Reveal>
              <span className="eyebrow !text-primary-300">{t('home.why.eyebrow')}</span>
              <h2 className="heading-lg !text-white mt-3">{t('home.why.title')}</h2>
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
                        <h4 className="font-bold text-lg text-white">
                          {t(`home.why.items.${key}.title`)}
                        </h4>
                        <p className="mt-1 text-sm text-white/60 leading-relaxed">
                          {t(`home.why.items.${key}.body`)}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <Reveal delay={0.35}>
              <Link to="/about" className="btn bg-white text-ink hover:bg-primary hover:text-white mt-8">
                {t('nav.about')}
                <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VIDEO — founder's word
      ══════════════════════════════════════════ */}
      <section className="relative section bg-ink text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 grain opacity-10 pointer-events-none" aria-hidden />
        <div className="absolute -top-24 -start-24 h-96 w-96 rounded-full bg-primary/8 blur-3xl pointer-events-none" aria-hidden />
        <div className="absolute -bottom-24 -end-24 h-96 w-96 rounded-full bg-primary/6 blur-3xl pointer-events-none" aria-hidden />

        <div className="relative container-page">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow !text-primary-300">
              <Quote className="h-3.5 w-3.5" />
              {t('home.video.eyebrow')}
            </span>
            <h2 className="heading-lg !text-white mt-3">{t('home.video.title')}</h2>
            <p className="lead !text-white/60 mt-4">{t('home.video.subtitle')}</p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="max-w-4xl mx-auto">
              {/* Video frame */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                {playing ? (
                  <iframe
                    src="https://www.youtube.com/embed/dCpD5pqCINY?autoplay=1&rel=0&modestbranding=1"
                    title={t('home.video.title')}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <>
                    {/* Thumbnail */}
                    <img
                      src="https://img.youtube.com/vi/dCpD5pqCINY/maxresdefault.jpg"
                      alt={t('home.video.title')}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-ink/50" />
                    {/* Play button */}
                    <button
                      onClick={() => setPlaying(true)}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-5 group"
                      aria-label={t('home.video.play')}
                    >
                      <div className="relative flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary shadow-2xl group-hover:scale-110 group-hover:bg-primary-600 transition-all duration-300">
                        <Play className="h-9 w-9 sm:h-11 sm:w-11 text-white fill-white ms-1" />
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping" />
                      </div>
                      <span className="text-white font-semibold text-sm sm:text-base tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
                        {t('home.video.play')}
                      </span>
                    </button>
                  </>
                )}
              </div>

              {/* Attribution bar */}
              <div className="mt-6 flex items-center justify-center gap-3 text-white/45 text-sm">
                <span className="h-px w-8 bg-primary inline-block" />
                <span>{t('home.video.attribution')}</span>
                <span className="h-px w-8 bg-primary inline-block" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CLIENTS — logo slider
      ══════════════════════════════════════════ */}
      <section className="section-tight bg-white border-y border-ink-100">
        <div className="container-page text-center mb-10">
          <Reveal>
            <span className="eyebrow">{t('home.clients.eyebrow')}</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-3 text-ink">
              {t('home.clients.title')}
            </h2>
          </Reveal>
        </div>
        <ClientSlider />
      </section>

      {/* ══════════════════════════════════════════
          CTA — dark box with red accent
      ══════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden bg-ink rounded-2xl px-8 py-16 md:px-16 md:py-20 text-white">
              {/* Left red bar */}
              <div className="absolute start-0 top-0 bottom-0 w-1.5 bg-primary rounded-s-2xl" />
              {/* Decorative glow */}
              <div className="absolute -top-16 -end-16 h-80 w-80 rounded-full bg-primary/15 blur-3xl pointer-events-none" aria-hidden />
              <div className="absolute bottom-0 end-32 h-48 w-48 rounded-full bg-primary/8 blur-2xl pointer-events-none" aria-hidden />

              <div className="relative max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-300">
                    {t('home.why.badge')}
                  </span>
                </div>
                <h2 className="heading-lg !text-white">{t('home.cta.title')}</h2>
                <p className="mt-4 text-white/65 text-lg leading-relaxed">{t('home.cta.subtitle')}</p>
                <Link
                  to="/contact"
                  className="btn bg-primary text-white hover:bg-primary-600 shadow-lg hover:shadow-xl mt-8 !px-8 !py-4 !text-base active:scale-[0.98]"
                >
                  {t('home.cta.button')}
                  <ArrowRight className="h-5 w-5 rtl-flip" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

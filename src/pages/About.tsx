import { useTranslation } from 'react-i18next';
import { ShieldCheck, HardHat, Sparkles, Handshake, CheckCircle2 } from 'lucide-react';
import SEO from '../components/util/SEO';
import PageHero from '../components/ui/PageHero';
import Reveal from '../components/ui/Reveal';

const valueIcons = {
  integrity: ShieldCheck,
  safety: HardHat,
  excellence: Sparkles,
  partnership: Handshake,
} as const;

export default function About() {
  const { t } = useTranslation();
  const founderPoints = t('about.founder.points', { returnObjects: true }) as string[];

  return (
    <>
      <SEO title={t('nav.about')} description={t('about.hero.subtitle')} />
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
            <div className="mt-10 grid sm:grid-cols-3 gap-6">
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

      {/* Founder */}
      <section className="section bg-sand">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="aspect-[4/3] sm:aspect-[4/5] overflow-hidden rounded-3xl shadow-soft">
              <img
                src="/assets/people/Mr.Raed Abu Sonbul.jpeg"
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

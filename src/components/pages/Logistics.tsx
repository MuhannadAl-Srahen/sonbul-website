import { MapPin, Building, ArrowRight, CheckCircle2, Truck, Forklift } from 'lucide-react';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';

interface ProjectLoc {
  name: string;
  body: string;
}

interface Props {
  lang: Lang;
}

export default function Logistics({ lang }: Props) {
  const { t } = useLocale(lang);
  const href = (path: string) => localizedHref(path, lang);
  const headPoints = t('logistics.locations.headOffice.points', { returnObjects: true }) as string[];
  const projects = t('logistics.locations.projects', { returnObjects: true }) as ProjectLoc[];
  const capabilities = t('logistics.locations.capabilities', { returnObjects: true }) as string[];
  const capIcons = [Truck, Forklift, Building];

  return (
    <>
      <PageHero
        eyebrow={t('logistics.hero.eyebrow')}
        title={t('logistics.hero.title')}
        subtitle={t('logistics.hero.subtitle')}
      />

      {/* Capabilities band */}
      <section className="section-tight border-b border-ink-100">
        <div className="container-page grid sm:grid-cols-3 gap-6">
          {capabilities.map((label, i) => {
            const Icon = capIcons[i] ?? Truck;
            return (
              <Reveal key={label} delay={i * 0.08}>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-sand hover:bg-primary/5 transition-colors duration-200">
                  <Icon className="h-7 w-7 text-primary flex-shrink-0" />
                  <span className="font-semibold">{label}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Head office */}
      <section className="section">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <div className="aspect-[5/4] overflow-hidden rounded-3xl shadow-soft">
              <img
                src="/assets/gallery/logistics/slide-0023.jpg"
                alt={t('logistics.locations.headOffice.title')}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <span className="eyebrow">{t('logistics.locations.title')}</span>
              <h2 className="heading-lg mt-3">{t('logistics.locations.headOffice.title')}</h2>
              <div className="mt-2 h-1 w-14 bg-primary rounded-full" />
            </Reveal>
            <ul className="mt-8 space-y-4">
              {headPoints.map((p, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-ink-700">{p}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section bg-sand">
        <div className="container-page">
          <Reveal className="max-w-2xl mb-12">
            <span className="eyebrow">
              <MapPin className="h-3.5 w-3.5" />
              {t('logistics.locations.title')}
            </span>
            <h2 className="heading-lg mt-3">{t('logistics.locations.projectsTitle')}</h2>
            <p className="lead mt-4">{t('logistics.hero.subtitle')}</p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <article className="card p-7 h-full hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{p.name}</h3>
                      <p className="mt-2 text-ink-500 leading-relaxed">{p.body}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-page text-center max-w-2xl mx-auto">
          <Reveal>
            <h2 className="heading-lg">{t('home.cta.title')}</h2>
            <p className="lead mt-4">{t('home.cta.subtitle')}</p>
            <a href={href('/contact')} className="btn-primary mt-8 hover:shadow-lg transition-shadow">
              {t('home.cta.button')}
              <ArrowRight className="h-4 w-4 rtl-flip" />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

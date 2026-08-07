import { ArrowRight } from 'lucide-react';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { COMPANY_BY_ID, heroImageFor, type CompanyId } from '../../data/companies';
import PageHero from '../ui/PageHero';
import ClientSlider from '../ui/ClientSlider';
import Reveal from '../ui/Reveal';
import SectionHeader from '../sections/SectionHeader';
import StatStrip, { type Stat } from '../sections/StatStrip';
import ServiceGrid from '../sections/ServiceGrid';
import FeatureGrid from '../sections/FeatureGrid';
import PhotoStrip from '../sections/PhotoStrip';
import CTABand from '../sections/CTABand';
import { logosFor } from '../../data/clientLogos';
import { PROJECTS } from '../../data/projects';
import { CROSSINGS } from '../../data/crossings';
import { companyChrome, serviceKeys } from './companyChrome';
import EyebrowRule from '../ui/EyebrowRule';


interface Props {
  company: CompanyId;
  lang: Lang;
}

export default function CompanyLanding({ company, lang }: Props) {
  const { t } = useLocale(lang);
  const c = COMPANY_BY_ID[company];
  const cfg = companyChrome[company];
  const ns = c.i18nKey;
  const href = (path: string) => localizedHref(path, lang);

  const stats: Stat[] = cfg.statKeys.map((key) => ({
    end: Number(t(`${ns}.stats.${key}.value`)),
    suffix: t(`${ns}.stats.${key}.suffix`),
    label: t(`${ns}.stats.${key}.label`),
  }));

  const services = serviceKeys[company].map((key) => ({
    key,
    icon: cfg.serviceIcons[key],
    title: t(`${ns}.services.items.${key}.title`),
    short: t(`${ns}.services.items.${key}.short`),
    href: href(`${c.base}${cfg.serviceLinks[key] ?? '/services'}`),
  }));

  const features = cfg.featureKeys.map((key) => ({
    key,
    title: t(`${ns}.highlights.items.${key}.title`),
    body: t(`${ns}.highlights.items.${key}.body`),
  }));

  const { logos } = logosFor(company);

  return (
    <>
      <PageHero
        eyebrow={t(`${ns}.hero.eyebrow`)}
        title={t(`${ns}.hero.title`)}
        subtitle={t(`${ns}.hero.subtitle`)}
        image={heroImageFor(c, lang)}
        overlay={cfg.overlay}
        texture={cfg.texture}
        rule={<EyebrowRule company={company} />}
      >
        <div className="flex flex-wrap gap-3">
          <a href={`${href('/')}#contact`} className="btn-primary">
            {t(`${ns}.hero.ctaPrimary`)}
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </a>
          <a
            href={href(`${c.base}/services`)}
            className="btn border-2 border-white/30 text-white transition-all duration-200 hover:border-white hover:bg-white hover:text-ink"
          >
            {t(`${ns}.hero.ctaSecondary`)}
          </a>
        </div>
      </PageHero>

      <StatStrip items={stats} />

      {/* Why us: dark band, numbered list */}
      <section className="section bg-ink text-white">
        <div className="container-page">
          <SectionHeader
            eyebrow={t(`${ns}.highlights.eyebrow`)}
            title={t(`${ns}.highlights.title`)}
            tone="dark"
          />
          <div className="mt-12">
            <FeatureGrid items={features} />
          </div>
        </div>
      </section>

      {/* Services mosaic */}
      <section className="section bg-white">
        <div className="container-page">
          {/* Centred, with the button below rather than pushed to the side, so this
              heading reads the same as every other section heading on the site. */}
          <SectionHeader
            eyebrow={t(`${ns}.services.eyebrow`)}
            title={t(`${ns}.services.title`)}
            subtitle={t(`${ns}.services.subtitle`)}
            className="mb-10"
          />
          <Reveal delay={0.2} className="mb-12 flex justify-center">
            <a href={href(`${c.base}/services`)} className="btn-outline">
              {t('common.knowMore')}
              <ArrowRight className="h-4 w-4 rtl-flip" />
            </a>
          </Reveal>
          <ServiceGrid items={services} moreLabel={t('common.knowMore')} />
        </div>
      </section>

      {/* Projects (company 2) / crossings (company 3) */}
      {company === 'project-services' && (
        <section className={`section ${cfg.surface}`}>
          <div className="container-page">
            <SectionHeader
              eyebrow={t(`${ns}.projects.eyebrow`)}
              title={t(`${ns}.projects.title`)}
              subtitle={t(`${ns}.projects.subtitle`)}
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {PROJECTS.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <a href={href(`${c.base}/projects/${p.slug}`)} className="card group block h-full p-8">
                    <span className="eyebrow">{t(`${ns}.projects.items.${p.key}.meta`)}</span>
                    <h3 className="mt-3 text-2xl font-bold text-ink">
                      {t(`${ns}.projects.items.${p.key}.name`)}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-500">
                      {t(`${ns}.projects.items.${p.key}.short`)}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                      {t('common.knowMore')}
                      <ArrowRight className="h-4 w-4 rtl-flip" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {company === 'logistics' && (
        <section className={`section ${cfg.surface}`}>
          <div className="container-page">
            <SectionHeader
              eyebrow={t(`${ns}.crossings.eyebrow`)}
              title={t(`${ns}.crossings.title`)}
              subtitle={t(`${ns}.crossings.subtitle`)}
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CROSSINGS.map((cr, i) => (
                <Reveal key={cr.slug} delay={i * 0.08}>
                  <a
                    href={href(`${c.base}/crossings/${cr.slug}`)}
                    className="card group block h-full p-6"
                  >
                    <span className="eyebrow">{t(`${ns}.crossings.items.${cr.key}.corridor`)}</span>
                    <h3 className="mt-3 text-xl font-bold text-ink">
                      {t(`${ns}.crossings.items.${cr.key}.name`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">
                      {t(`${ns}.crossings.items.${cr.key}.short`)}
                    </p>
                    <ArrowRight className="mt-5 h-4 w-4 rtl-flip text-primary transition-transform group-hover:translate-x-1" />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photos */}
      <section className="section-tight bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow={t(`${ns}.gallery.eyebrow`)}
            title={t(`${ns}.gallery.title`)}
            className="mb-10"
          />
          <PhotoStrip
            query={cfg.photos}
            lang={lang}
            altPrefix={t(`companies.${company}.name`)}
            seeAllLabel={t(`${ns}.gallery.seeAll`)}
            seeAllHref={`${href('/')}?company=${company}#gallery`}
          />
        </div>
      </section>

      {/* Clients */}
      <section className={`section-tight ${cfg.surface}`}>
        <div className="container-page">
          <Reveal className="mb-8 text-center">
            <span className="eyebrow">{t('group.clients.eyebrow')}</span>
            {/* Always the group heading. The branch that used a per-company one only had
                copy for transport, so raising any other company above the logo threshold
                in clientLogos.ts would have rendered the raw key as an <h2>. */}
            <h2 className="heading-lg mt-3">{t('group.clients.title')}</h2>
          </Reveal>
          <ClientSlider lang={lang} logos={logos} />
        </div>
      </section>

      <CTABand
        title={t(`${ns}.cta.title`)}
        subtitle={t(`${ns}.cta.subtitle`)}
        cta={{
          label: t(`${ns}.cta.button`),
          href: `${href('/')}#contact`,
        }}
        badge={company === 'project-services' ? t(`${ns}.badge`) : undefined}
      />
    </>
  );
}

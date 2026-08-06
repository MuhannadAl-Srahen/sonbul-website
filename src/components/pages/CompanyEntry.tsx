import { ArrowRight } from 'lucide-react';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { COMPANY_BY_ID, type CompanyId } from '../../data/companies';
import { getProject } from '../../data/projects';
import { getCrossing } from '../../data/crossings';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import PhotoStrip from '../sections/PhotoStrip';
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
  slug: string;
  lang: Lang;
}

/**
 * One project case study or one border crossing.
 *
 * Photos come from the entry's own tags in the media manifest, so this page shows the
 * ARGAS photos rather than a generic camps dump — that is the whole point of the tags.
 */
export default function CompanyEntry({ collection, slug, lang }: Props) {
  const { t } = useLocale(lang);
  const company = owner[collection];
  const c = COMPANY_BY_ID[company];
  const ns = c.i18nKey;
  const chrome = companyChrome[company];
  const href = (path: string) => localizedHref(path, lang);

  const entry = collection === 'projects' ? getProject(slug) : getCrossing(slug);
  if (!entry) return null;

  const base = `${ns}.${collection}.items.${entry.key}`;
  const meta = collection === 'projects' ? t(`${base}.meta`) : t(`${base}.corridor`);

  return (
    <>
      <PageHero
        eyebrow={meta}
        title={t(`${base}.name`)}
        subtitle={t(`${base}.short`)}
        image={chrome.hero}
        overlay={chrome.overlay}
        texture={chrome.texture}
        rule={<EyebrowRule company={company} />}
      />

      <section className="section bg-white">
        <div className="container-page max-w-3xl">
          <Reveal>
            <p className="lead">{t(`${base}.body`)}</p>
          </Reveal>
        </div>
      </section>

      <section className={`section-tight ${chrome.surface}`}>
        <div className="container-page">
          <Reveal className="mb-10 max-w-2xl">
            <span className="eyebrow">{t(`${ns}.gallery.eyebrow`)}</span>
            <h2 className="heading-lg mt-3">{t(`${base}.name`)}</h2>
          </Reveal>
          {/* Falls back to the company's photos while the manifest is still untagged. */}
          <PhotoStrip
            query={{ ...chrome.photos, tags: entry.tags }}
            lang={lang}
            altPrefix={t(`${base}.name`)}
            seeAllLabel={t(`${ns}.gallery.seeAll`)}
            seeAllHref={`${href('/')}?company=${company}&tag=${entry.tags[0]}#gallery`}
          />
        </div>
      </section>

      <CTABand
        title={t(`${ns}.cta.title`)}
        subtitle={t(`${ns}.cta.subtitle`)}
        cta={{
          label: t(`${ns}.cta.button`),
          href: `${href('/')}#contact`,
        }}
      />

      <div className="container-page pb-16">
        <a
          href={href(`${c.base}/${collection}`)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
        >
          <ArrowRight className="h-4 w-4 rotate-180 rtl-flip" />
          {t(`${ns}.${collection}.title`)}
        </a>
      </div>
    </>
  );
}

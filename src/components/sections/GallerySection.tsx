import { useMemo, useState, useCallback } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';
import { ChevronLeft, ChevronRight, Images, Play } from 'lucide-react';
import clsx from 'clsx';
import Reveal from '../ui/Reveal';
import { useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { galleryItems } from '../../data/galleryItems';
import { categoriesFor, type GalleryCategory, type MediaTag } from '../../data/media';
import { COMPANIES, type CompanyId } from '../../data/companies';
import { useQueryParam } from '../../hooks/useQueryParam';

type Filter = 'all' | GalleryCategory;
type CompanyFilter = 'all' | CompanyId;

const PAGE_SIZE = 16;

interface Props {
  lang: Lang;
}

interface Selection {
  company: CompanyFilter;
  filter: Filter;
  tag: MediaTag | null;
}

export default function GallerySection({ lang }: Props) {
  const { t } = useLocale(lang);
  const [page, setPage] = useState(0);
  const [openIndex, setOpenIndex] = useState(-1);
  // Track which images failed to load so they are hidden
  const [brokenSrcs, setBrokenSrcs] = useState<Set<string>>(new Set());

  const handleImgError = useCallback((src: string) => {
    setBrokenSrcs((prev) => new Set(prev).add(src));
  }, []);

  // The deep link seeds the filters; a click replaces them wholesale. Holding the whole
  // selection in one piece of state keeps "changing company clears the category" honest.
  const paramCompany = useQueryParam('company');
  const paramCategory = useQueryParam('category');
  const paramTag = useQueryParam('tag');
  const [selection, setSelection] = useState<Selection | null>(null);

  const { company, filter, tag } = selection ?? {
    company: COMPANIES.some((c) => c.id === paramCompany) ? (paramCompany as CompanyId) : 'all',
    filter: (paramCategory as Filter) ?? 'all',
    tag: (paramTag as MediaTag) ?? null,
  };

  const filtered = useMemo(() => {
    let base = galleryItems;
    if (company !== 'all') base = base.filter((i) => i.company === company);
    if (filter !== 'all') base = base.filter((i) => i.category === filter);
    // A tag that matches nothing is ignored rather than emptying the grid — the library
    // is only fully tagged in the final pass.
    if (tag) {
      const tagged = base.filter((i) => i.tags.includes(tag));
      if (tagged.length) base = tagged;
    }
    return base.filter((i) => !brokenSrcs.has(i.thumb));
  }, [company, filter, tag, brokenSrcs]);

  // Only the categories the selected company actually has photos in.
  const categories = useMemo(() => categoriesFor(company), [company]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageStart = safePage * PAGE_SIZE;
  const shown = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // The lightbox gets the whole filtered set, not just the current page, so paging through it
  // continues past the 16th image instead of dead-ending at the page boundary.
  const slides = useMemo(
    () =>
      filtered.map((item) =>
        item.kind === 'video'
          ? {
              type: 'video' as const,
              width: item.width,
              height: item.height,
              poster: item.poster,
              sources: [{ src: item.src, type: 'video/mp4' }],
            }
          : { src: item.full },
      ),
    [filtered],
  );

  const selectFilter = (f: Filter) => { setSelection({ company, filter: f, tag: null }); setPage(0); };

  // Switching company clears the category, which may not exist for the new one.
  const selectCompany = (c: CompanyFilter) => { setSelection({ company: c, filter: 'all', tag: null }); setPage(0); };

  const goToPage = (p: number) => {
    setPage(p);
  };

  const filters: Filter[] = ['all', ...categories];

  const pillClass = (active: boolean) =>
    clsx(
      'rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
      active ? 'bg-primary text-white shadow-sm' : 'bg-ink/5 text-ink hover:bg-ink/10',
    );

  const altFor = (item: (typeof galleryItems)[number]) =>
    item.alt?.[lang] ?? `${t(`companies.${item.company}.short`)} — ${t(`gallery.filters.${item.category}`)}`;

  return (
    <>
      <section id="gallery" className="section scroll-mt-28 bg-white">
        <div className="container-page">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow justify-center">
              <Images className="h-4 w-4" />
              {t('gallery.hero.eyebrow')}
            </span>
            <h2 className="heading-lg mt-3">{t('gallery.hero.title')}</h2>
            <p className="lead mx-auto mt-4 max-w-2xl">{t('gallery.hero.subtitle')}</p>
          </Reveal>

          {/* Filters — company first, then category within it. Held in a floating glass
              tray so the controls read as one panel rather than two loose rows. */}
          <Reveal className="mb-10 flex justify-center">
            <div className="glass w-full max-w-3xl p-3 sm:p-4">
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => selectCompany('all')}
                  className={pillClass(company === 'all')}
                >
                  {t('gallery.allCompanies')}
                </button>
                {COMPANIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectCompany(c.id)}
                    className={pillClass(company === c.id)}
                  >
                    {t(`companies.${c.id}.short`)}
                  </button>
                ))}
              </div>

              {/* A single category is no choice at all, so the row only appears when there is one. */}
              {categories.length > 1 && (
                <div className="mt-3 flex flex-wrap justify-center gap-2 border-t border-ink-100 pt-3">
                  {filters.map((f) => (
                    <button
                      key={f}
                      onClick={() => selectFilter(f)}
                      className={clsx(
                        'rounded-full px-4 py-2 text-xs font-semibold transition-all',
                        filter === f
                          ? 'bg-ink text-white'
                          : 'bg-transparent text-ink-500 hover:bg-ink/5 hover:text-ink',
                      )}
                    >
                      {t(`gallery.filters.${f}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {filtered.length === 0 && (
            <Reveal>
              <p className="rounded-2xl bg-ink-50 py-16 text-center text-sm text-ink-500">
                {t('gallery.empty')}
              </p>
            </Reveal>
          )}

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {shown.map((item, idx) => (
              <button
                key={`${company}-${filter}-${item.thumb}`}
                onClick={() => setOpenIndex(pageStart + idx)}
                aria-label={item.kind === 'video' ? t('gallery.playVideo') : altFor(item)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-ink-100 aspect-square focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <img
                  src={item.thumb}
                  alt={altFor(item)}
                  width={600}
                  height={600}
                  loading="lazy"
                  onError={() => handleImgError(item.thumb)}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {item.kind === 'video' && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                      <Play className="h-6 w-6 translate-x-0.5 fill-primary text-primary" />
                    </span>
                  </span>
                )}
                <span className="absolute bottom-3 start-3 text-xs font-semibold uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {t(`gallery.filters.${item.category}`)}
                </span>
              </button>
            ))}
          </div>

          {/* Prev / Next pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 0}
                className={clsx(
                  'inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-semibold border transition-all',
                  safePage === 0
                    ? 'border-ink/10 text-ink/30 cursor-not-allowed'
                    : 'border-ink/20 text-ink hover:bg-ink hover:text-white hover:border-ink',
                )}
              >
                <ChevronLeft className="h-4 w-4 rtl-flip flex-shrink-0" />
                <span className="max-sm:hidden">{t('gallery.prev')}</span>
              </button>

              {/* The dot is decorative; the button around it carries the 24px hit area
                  WCAG 2.5.8 asks for. A bare 10px dot is not tappable on a phone. */}
              <div className="flex items-center">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className="grid h-6 w-6 place-items-center rounded-full"
                    aria-label={`${t('gallery.page')} ${i + 1}`}
                    aria-current={i === safePage ? 'true' : undefined}
                  >
                    <span
                      className={clsx(
                        'block rounded-full transition-all',
                        i === safePage ? 'bg-primary w-5 h-2.5' : 'bg-ink/20 hover:bg-ink/40 w-2.5 h-2.5',
                      )}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage >= totalPages - 1}
                className={clsx(
                  'inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-semibold border transition-all',
                  safePage >= totalPages - 1
                    ? 'border-ink/10 text-ink/30 cursor-not-allowed'
                    : 'border-ink/20 text-ink hover:bg-ink hover:text-white hover:border-ink',
                )}
              >
                <span className="max-sm:hidden">{t('gallery.next')}</span>
                <ChevronRight className="h-4 w-4 rtl-flip flex-shrink-0" />
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <p className="text-center text-xs text-ink-500 mt-4">
              {safePage + 1} / {totalPages} — {shown.length} {t('gallery.of')} {filtered.length}
            </p>
          )}
        </div>
      </section>

      <Lightbox
        open={openIndex >= 0}
        close={() => setOpenIndex(-1)}
        index={openIndex < 0 ? 0 : openIndex}
        slides={slides}
        plugins={[Video]}
        video={{ controls: true, playsInline: true }}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,.93)' } }}
      />
    </>
  );
}

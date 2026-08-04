import { useMemo, useState, useCallback } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';
import { ChevronLeft, ChevronRight, Images, Play } from 'lucide-react';
import clsx from 'clsx';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import { useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { galleryItems, GALLERY_CATEGORIES } from '../../data/galleryItems';
import type { GalleryCategory } from '../../data/galleryItems';

type Filter = 'all' | GalleryCategory;

const PAGE_SIZE = 16;

interface Props {
  lang: Lang;
}

export default function Gallery({ lang }: Props) {
  const { t } = useLocale(lang);
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(0);
  const [openIndex, setOpenIndex] = useState(-1);
  // Track which images failed to load so they are hidden
  const [brokenSrcs, setBrokenSrcs] = useState<Set<string>>(new Set());

  const handleImgError = useCallback((src: string) => {
    setBrokenSrcs((prev) => new Set(prev).add(src));
  }, []);

  const filtered = useMemo(() => {
    const base = filter === 'all' ? galleryItems : galleryItems.filter((i) => i.category === filter);
    return base.filter((i) => !brokenSrcs.has(i.thumb));
  }, [filter, brokenSrcs]);

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

  const selectFilter = (f: Filter) => { setFilter(f); setPage(0); };

  const goToPage = (p: number) => {
    setPage(p);
  };

  const filters: Filter[] = ['all', ...GALLERY_CATEGORIES];

  return (
    <>
      <PageHero
        eyebrow={t('gallery.hero.eyebrow')}
        title={t('gallery.hero.title')}
        subtitle={t('gallery.hero.subtitle')}
      />

      <section className="section">
        <div className="container-page">

          {/* Section intro */}
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <Images className="h-5 w-5 text-primary" />
              <span className="eyebrow">{t('gallery.hero.eyebrow')}</span>
            </div>
            <p className="lead">{t('gallery.hero.subtitle')}</p>
          </Reveal>

          {/* Filters */}
          <Reveal>
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => selectFilter(f)}
                  className={clsx(
                    'rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
                    filter === f
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-ink/5 text-ink hover:bg-ink/10',
                  )}
                >
                  {t(`gallery.filters.${f}`)}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {shown.map((item, idx) => (
              <button
                key={`${filter}-${item.thumb}`}
                onClick={() => setOpenIndex(pageStart + idx)}
                aria-label={item.kind === 'video' ? t('gallery.playVideo') : t(`gallery.filters.${item.category}`)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-ink-100 aspect-square focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <img
                  src={item.thumb}
                  alt={t(`gallery.filters.${item.category}`)}
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
                <span className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity">
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

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={clsx(
                      'rounded-full transition-all',
                      i === safePage ? 'bg-primary w-6 h-2.5' : 'bg-ink/15 hover:bg-ink/30 w-2.5 h-2.5',
                    )}
                    aria-label={`Page ${i + 1}`}
                  />
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
            <p className="text-center text-xs text-ink/40 mt-4">
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

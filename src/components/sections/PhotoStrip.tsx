import { ArrowRight } from 'lucide-react';
import Reveal from '../ui/Reveal';
import { mediaFor, type MediaQuery } from '../../data/media';
import type { Lang } from '../../i18n';

interface Props {
  query: MediaQuery;
  lang: Lang;
  /** Fallback alt when a photo has no per-image text in the manifest yet. */
  altPrefix: string;
  seeAllLabel?: string;
  seeAllHref?: string;
}

/**
 * A band of photos pulled straight from the media manifest by tag.
 *
 * Horizontal snap-scroller on mobile so a phone shows real photos rather than a stack
 * of crops; a grid from md up. Renders nothing when the query matches nothing, so a
 * page never ships an empty heading.
 */
export default function PhotoStrip({ query, lang, altPrefix, seeAllLabel, seeAllHref }: Props) {
  const items = mediaFor({ limit: 8, ...query });
  if (!items.length) return null;

  return (
    <Reveal>
      <div className="marquee-fade no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
        {items.map((item) => (
          <figure
            key={item.id}
            className="w-56 flex-shrink-0 snap-start overflow-hidden rounded-xl bg-ink-50 md:w-auto"
          >
            <img
              src={item.thumb}
              alt={item.alt?.[lang] ?? altPrefix}
              loading="lazy"
              decoding="async"
              width={600}
              height={600}
              className="aspect-square h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </figure>
        ))}
      </div>
      {seeAllHref && seeAllLabel && (
        <a
          href={seeAllHref}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
        >
          {seeAllLabel}
          <ArrowRight className="h-4 w-4 rtl-flip" />
        </a>
      )}
    </Reveal>
  );
}

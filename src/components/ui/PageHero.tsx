import clsx from 'clsx';
import type { ReactNode } from 'react';

/**
 * How the dark overlay sits over the hero photo. This is one of the four axes that make
 * the three companies feel distinct without introducing a second brand colour — every
 * variant is built from `ink` and `primary` only.
 */
export type HeroOverlay = 'sweep' | 'lift' | 'diagonal';

const overlays: Record<HeroOverlay, string> = {
  // Motion along a road — the incumbent treatment.
  sweep: 'bg-gradient-to-r rtl:bg-gradient-to-l from-ink/90 via-ink/75 to-ink/35',
  // Settled ground, a camp on a site.
  lift: 'bg-gradient-to-t from-ink via-ink/80 to-ink/35',
  // Heavy iron in a border yard. primary-900 at 55% is near-black with a red bias.
  diagonal: 'bg-gradient-to-br rtl:bg-gradient-to-bl from-ink/95 via-ink/75 to-primary-900/55',
};

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  overlay?: HeroOverlay;
  /** Extra glyphs after the eyebrow rule — the per-company eyebrow signature. */
  rule?: ReactNode;
  texture?: 'grain' | 'hatch' | 'none';
  children?: ReactNode;
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  overlay = 'sweep',
  rule,
  texture = 'grain',
  children,
}: Props) {
  return (
    /* -mt-20 pulls this section behind the sticky header (h-20),
       so the transparent/blur header sits on top of the dark hero — same effect as home page. */
    <section className="relative overflow-hidden min-h-[46vh] sm:min-h-[58vh] flex flex-col justify-end bg-ink -mt-20">
      {/* Background */}
      {image ? (
        <div className="absolute inset-0">
          <img
            src={image}
            alt=""
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
          <div className={clsx('absolute inset-0', overlays[overlay])} />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-800 to-ink-700" />
      )}
      {texture !== 'none' && (
        <div
          className={clsx('absolute inset-0 pointer-events-none', texture, 'opacity-15')}
          aria-hidden
        />
      )}

      {/* Red accent line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />

      {/* pt-44 = 20 (header) + 24 (original padding) = content sits exactly where it did before */}
      <div className="relative container-page pb-12 sm:pb-14 pt-28 sm:pt-44">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-primary-300 mb-4">
            <span className="h-[2px] w-6 bg-primary inline-block" />
            {rule}
            {eyebrow}
          </span>
          <h1 className="page-hero-title text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] !text-white mt-2 hero-text-shadow">{title}</h1>
          {subtitle && (
            <p className="mt-5 text-lg md:text-xl !text-white/90 leading-relaxed max-w-2xl hero-text-shadow">{subtitle}</p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}

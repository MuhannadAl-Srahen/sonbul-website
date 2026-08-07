import clsx from 'clsx';
import type { ReactNode } from 'react';

/**
 * How the dark overlay sits over the hero photo. This is one of the four axes that make
 * the three companies feel distinct without introducing a second brand colour: every
 * variant is built from `ink` and `primary` only.
 */
export type HeroOverlay = 'sweep' | 'lift' | 'diagonal';

const overlays: Record<HeroOverlay, string> = {
  // Motion along a road: the incumbent treatment.
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
  /**
   * Where to anchor the crop, as a Tailwind object-position class.
   *
   * Only one axis is ever cropped, so the vertical half of this governs wide screens
   * and the horizontal half governs phones. Companies whose hero has a subject off to
   * one side set it; the rest centre.
   */
  imagePosition?: string;
  /** Extra glyphs after the eyebrow rule: the per-company eyebrow signature. */
  rule?: ReactNode;
  texture?: 'grain' | 'hatch' | 'none';
  /**
   * `full` matches the group landing page: a whole screen, and on a phone the photo runs
   * in flow at its own proportions below the copy rather than being cropped to fill.
   * A company landing is the same kind of page as the group one and looked wrong at half
   * the height beside it. `compact` is for everything underneath them.
   */
  size?: 'full' | 'compact';
  children?: ReactNode;
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  overlay = 'sweep',
  imagePosition = 'object-center',
  rule,
  texture = 'grain',
  size = 'compact',
  children,
}: Props) {
  const full = size === 'full';

  /* On a phone a `full` hero puts the photo in flow underneath the copy, so it shows
     whole at its own proportions instead of being cropped to fill a tall narrow box.
     From lg up, and for `compact` at every width, it is the full-bleed background. */
  const media = image ? (
    <div className={clsx('relative', full ? 'lg:absolute lg:inset-0' : 'absolute inset-0')}>
      <img
        src={image}
        alt=""
        width={1678}
        height={937}
        fetchPriority="high"
        className={clsx(
          full ? 'w-full lg:h-full lg:object-cover' : 'h-full w-full object-cover',
          imagePosition,
        )}
      />
      {full && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-ink to-transparent lg:hidden"
          aria-hidden
        />
      )}
      <div className={clsx('absolute inset-0', full && 'hidden lg:block', overlays[overlay])} />
    </div>
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-800 to-ink-700" />
  );

  return (
    /* The header is fixed and floats over this, so no negative margin is needed to pull
       the hero underneath it. The padding below simply clears the bar. */
    <section
      className={clsx(
        'relative overflow-hidden flex flex-col bg-ink',
        full
          ? 'min-h-[100svh] lg:h-[100svh] lg:min-h-[54rem] justify-center'
          : 'min-h-[46vh] sm:min-h-[58vh] justify-end',
      )}
    >
      {!full && media}
      {texture !== 'none' && (
        <div
          className={clsx('absolute inset-0 pointer-events-none', texture, 'opacity-15')}
          aria-hidden
        />
      )}

      {/* Red accent line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary z-10" />

      {/* pt-44 = 20 (header) + 24 (original padding) = content sits exactly where it did before */}
      <div
        className={clsx(
          'relative z-10 container-page pb-12 sm:pb-14 pt-28 sm:pt-44',
          full && 'flex-1 flex flex-col justify-center',
        )}
      >
        <div className="animate-fade-in-up">
          {/* Glass chip, echoing the floating header above it. */}
          <span className="glass-dark inline-flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary-200 mb-4">
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

      {/* After the copy in the DOM, so on a phone it lands below it without any ordering
          tricks, and from lg up it goes back to being the background behind everything. */}
      {full && media}
    </section>
  );
}

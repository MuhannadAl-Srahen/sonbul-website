import clsx from 'clsx';
import { Building2, HardHat, Ship, Truck } from 'lucide-react';
import Reveal from '../ui/Reveal';
import SectionHeader from './SectionHeader';
import { BOUNDS, JORDAN_OUTLINE, PLACES, type PlaceKind } from '../../data/places';
import { useLocale } from '../../i18n';
import type { Lang } from '../../i18n';

interface Props {
  lang: Lang;
}

const W = 480;
const H = 550;

/*
 * Longitude is squeezed by the cosine of the latitude, otherwise the country comes out
 * too wide: a degree of longitude at 31 degrees north is about 85% of a degree of
 * latitude. Without it Jordan looks like it has been sat on.
 */
const SQUEEZE = Math.cos(((BOUNDS.minLat + BOUNDS.maxLat) / 2) * (Math.PI / 180));
const spanLon = (BOUNDS.maxLon - BOUNDS.minLon) * SQUEEZE;
const spanLat = BOUNDS.maxLat - BOUNDS.minLat;

const x = (lon: number) => ((lon - BOUNDS.minLon) * SQUEEZE * W) / spanLon;
const y = (lat: number) => ((BOUNDS.maxLat - lat) * H) / spanLat;

const OUTLINE = JORDAN_OUTLINE.map(([lon, lat]) => `${x(lon).toFixed(1)},${y(lat).toFixed(1)}`).join(' ');

const kindIcons: Record<PlaceKind, typeof Building2> = {
  office: Building2,
  project: HardHat,
  crossing: Truck,
  port: Ship,
};

const KINDS: PlaceKind[] = ['office', 'project', 'crossing', 'port'];

/**
 * Where the group works, on a map of Jordan.
 *
 * A logistics business is defined by geography, so a map answers "places of service"
 * better than a list can. The list is rendered underneath anyway: an SVG is not text, so
 * without it the section would be invisible to search engines and to a screen reader.
 */
export default function PlacesMap({ lang }: Props) {
  const { t } = useLocale(lang);

  return (
    <section id="places" className="section bg-white">
      <div className="container-page">
        <SectionHeader
          eyebrow={t('places.eyebrow')}
          title={t('places.title')}
          subtitle={t('places.subtitle')}
          className="mb-14"
        />

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <Reveal>
            {/* `dir=ltr` pins the drawing: the map is geography, not text, and must not
                mirror when the page does. */}
            <div dir="ltr" className="mx-auto w-full max-w-xl">
              <svg
                /* Padded on every side so a label at the edge of the country is not
                   clipped by the viewport. */
                viewBox={`-70 -24 ${W + 150} ${H + 48}`}
                className="h-auto w-full"
                role="img"
                aria-label={t('places.mapAlt')}
              >
                <polygon
                  points={OUTLINE}
                  className="fill-ink-50 stroke-ink-200"
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
                {PLACES.map((p) => {
                  const cx = x(p.lon);
                  const cy = y(p.lat);
                  const office = p.kind === 'office';
                  return (
                    <g key={p.id}>
                      {/* A halo on the head office so the one permanent address reads
                          differently from the places we go to. */}
                      {office && <circle cx={cx} cy={cy} r={11} className="fill-primary/20" />}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={office ? 6 : 5}
                        className={office ? 'fill-primary' : 'fill-primary/80'}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                      <text
                        x={cx + p.dx}
                        y={cy + p.dy}
                        textAnchor={p.anchor}
                        className="fill-ink text-[13px] font-semibold"
                        style={{ paintOrder: 'stroke' }}
                        stroke="#fff"
                        strokeWidth={3}
                      >
                        {t(`places.items.${p.id}.name`)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </Reveal>

          <div>
            {KINDS.map((kind) => {
              const inKind = PLACES.filter((p) => p.kind === kind);
              if (!inKind.length) return null;
              const Icon = kindIcons[kind];
              return (
                <Reveal key={kind} className="mb-8 last:mb-0">
                  {/* Centred while the column is stacked under the map, at the start edge
                      from lg where it sits beside it. The places themselves stay
                      start-aligned at both sizes so their dots line up. */}
                  <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ink-400 lg:justify-start">
                    <Icon className="h-4 w-4 text-primary" />
                    {t(`places.kinds.${kind}`)}
                  </p>
                  {/* The block centres under the map while stacked; the entries inside
                      it share one edge, so their dots line up in a column. */}
                  <ul className="mx-auto mt-3 w-fit max-w-sm space-y-2 text-start lg:mx-0 lg:max-w-none">
                    {inKind.map((p) => (
                      <li key={p.id} className="flex gap-3">
                        <span
                          className={clsx(
                            'mt-2 h-2 w-2 flex-shrink-0 rounded-full',
                            p.kind === 'office' ? 'bg-primary' : 'bg-primary/60',
                          )}
                        />
                        <span className="text-sm leading-relaxed text-ink-700">
                          <span className="font-semibold text-ink">
                            {t(`places.items.${p.id}.name`)}
                          </span>
                          {': '}
                          {t(`places.items.${p.id}.note`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

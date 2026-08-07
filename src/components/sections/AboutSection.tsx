import { CheckCircle2, Handshake, HardHat, ShieldCheck, Sparkles } from 'lucide-react';
import Reveal from '../ui/Reveal';
import { useLocale } from '../../i18n';
import type { Lang } from '../../i18n';

const valueIcons = {
  integrity: ShieldCheck,
  safety: HardHat,
  excellence: Sparkles,
  partnership: Handshake,
} as const;

interface Props {
  lang: Lang;
}

/**
 * The condensed story, on the landing page.
 *
 * The standalone /about page is gone, so this keeps only what a visitor needs on a first
 * pass: how the group came to be, the four figures that back it, the founder in his own
 * words, and the values. The eight-point founder biography and the long-form history did
 * not survive the cut.
 */
export default function AboutSection({ lang }: Props) {
  const { t } = useLocale(lang);
  const stats = t('about.story.stats', { returnObjects: true }) as { k: string; v: string }[];
  const points = (t('about.founder.points', { returnObjects: true }) as string[]).slice(0, 4);

  return (
    <section id="about" className="section bg-white">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">{t('about.story.eyebrow')}</span>
          <h2 className="heading-lg mt-3">{t('about.story.title')}</h2>
        </Reveal>
        <div className="grid gap-12">
          <Reveal delay={0.1} className="mx-auto max-w-4xl text-center">
            <p className="lead mt-8">{t('about.story.body')}</p>
            <div className="mt-12 grid grid-cols-2 gap-6 text-start lg:grid-cols-4">
              {stats.map((b) => (
                <div key={b.k} className="border-s-2 border-primary ps-4">
                  <div className="text-2xl font-bold text-primary">{b.k}</div>
                  <div className="mt-1 text-sm text-ink-500">{b.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Founder. The block is centred and the first column is sized to the portrait
            rather than to half the shell: `grid-cols-2` gave the image a ~700px column to
            sit in while it was capped at 20rem, leaving a band of empty white between it
            and the text. Capping the pair keeps the bullet lines a readable length on a
            wide monitor too. */}
        <div className="mx-auto mt-20 grid max-w-5xl items-center gap-10 lg:grid-cols-[20rem_1fr] lg:gap-14">
          <Reveal>
            {/* Capped rather than filling the column: at half of a 1536px shell a 4:5
                portrait rendered around 800px tall and dominated the section. */}
            <div className="mx-auto aspect-[4/3] w-full max-w-[20rem] overflow-hidden rounded-3xl shadow-soft sm:aspect-[4/5]">
              <img
                src="/assets/people/raed-abu-sonbul.webp"
                alt={t('about.founder.name')}
                loading="lazy"
                decoding="async"
                width={900}
                height={900}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <span className="eyebrow">{t('about.founder.eyebrow')}</span>
              <h3 className="heading-lg mt-3">{t('about.founder.name')}</h3>
              <div className="mt-2 h-1 w-14 rounded-full bg-primary" />
            </Reveal>
            <ul className="mt-8 space-y-4">
              {points.map((p) => (
                <Reveal key={p}>
                  <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="leading-relaxed text-ink-700">{p}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        {/* Values */}
        <Reveal className="mx-auto mt-20 max-w-2xl text-center">
          <span className="eyebrow justify-center">{t('about.values.eyebrow')}</span>
          <h3 className="heading-lg mt-3">{t('about.values.title')}</h3>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(valueIcons) as Array<keyof typeof valueIcons>).map((k, i) => {
            const Icon = valueIcons[k];
            return (
              <Reveal key={k} delay={i * 0.08}>
                <div className="card h-full p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <Icon className="h-8 w-8 text-primary" />
                  <h4 className="mt-5 text-lg font-semibold">{t(`about.values.items.${k}.title`)}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {t(`about.values.items.${k}.body`)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

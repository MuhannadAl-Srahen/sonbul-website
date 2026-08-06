import { Briefcase, Building2, ClipboardList, Crown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Reveal from '../ui/Reveal';
import { useLocale } from '../../i18n';
import type { Lang } from '../../i18n';

/**
 * Leadership only.
 *
 * The standalone /team page and its 22 individual profiles are gone, so this keeps the
 * four people a visitor would actually want named and drops the department rosters —
 * which were largely one shared biography repeated across five staff members anyway.
 */
const leadership: { name: string; roleKey: string; icon: LucideIcon; photo?: string }[] = [
  { name: 'Mr. Raed Abu Sonbul', roleKey: 'gm', icon: Crown, photo: '/assets/people/raed-abu-sonbul.webp' },
  { name: 'Mr. Diaa Abu Sonbul', roleKey: 'vp', icon: Briefcase },
  { name: 'Mr. Ahmad Al Kurdi', roleKey: 'ceo', icon: Building2 },
  { name: 'Eng. Ramy El Haj', roleKey: 'operations', icon: ClipboardList },
];

const initials = (name: string) =>
  name
    .replace(/^(Mr\.|Eng\.|Ms\.)\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

interface Props {
  lang: Lang;
}

export default function TeamSection({ lang }: Props) {
  const { t } = useLocale(lang);

  return (
    <section id="team" className="section bg-sand">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">{t('team.hero.eyebrow')}</span>
          <h2 className="heading-lg mt-3">{t('team.leadershipTitle')}</h2>
          <p className="lead mt-4">{t('team.hero.subtitle')}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leadership.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className="card h-full p-7 text-center">
                  <div className="relative mx-auto w-fit">
                    {p.photo ? (
                      <img
                        src={p.photo}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        width={112}
                        height={112}
                        className="h-28 w-28 rounded-full border-2 border-primary/20 object-cover shadow-sm"
                      />
                    ) : (
                      <span className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                        {initials(p.name)}
                      </span>
                    )}
                    <span className="absolute -bottom-1 -end-1 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-ink">{p.name}</h3>
                  <p className="mt-1 text-sm text-primary">{t(`team.roles.${p.roleKey}`)}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

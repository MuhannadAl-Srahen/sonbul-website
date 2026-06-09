import {
  Crown,
  Briefcase,
  Building2,
  ClipboardList,
  Truck,
  PackageSearch,
  Wrench,
  BadgeDollarSign,
  Coins,
  ArrowRight,
} from 'lucide-react';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import { localizedHref, useLocale } from '../../i18n';
import type { Lang } from '../../i18n';

interface Member {
  name: string;
  slug: string;
  photo?: string;
}

const leadership = [
  { name: 'Mr. Raed Abu Sonbul',  slug: 'raed-abu-sonbul', roleKey: 'gm',        icon: Crown,         photo: '/assets/people/Mr.Raed Abu Sonbul.jpeg' },
  { name: 'Mr. Diaa Abu Sonbul',  slug: 'diaa-abu-sonbul', roleKey: 'vp',         icon: Briefcase,     photo: undefined },
  { name: 'Mr. Ahmad Al Kurdi',   slug: 'ahmad-al-kurdi',  roleKey: 'ceo',        icon: Building2,     photo: undefined },
  { name: 'Eng. Ramy El Haj',     slug: 'ramy-el-haj',     roleKey: 'operations', icon: ClipboardList, photo: undefined },
] as const;

const departments: {
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  members: Member[];
}[] = [
  {
    key: 'transportation',
    icon: Truck,
    members: [
      { name: 'Eng. Khaled Odeh', slug: 'khaled-odeh' },
      { name: 'Eng. Noor Alnees', slug: 'noor-alnees' },
      { name: 'Essa Katatsheh',   slug: 'essa-katatsheh' },
      { name: 'Talal Assi',       slug: 'talal-assi', photo: '/assets/people/Talal.jpeg' },
    ],
  },
  {
    key: 'logistics',
    icon: PackageSearch,
    members: [
      { name: 'Mohd Abd Sonbul', slug: 'mohd-abd-sonbul' },
      { name: 'Yahia Katatsheh', slug: 'yahia-katatsheh' },
      { name: 'Khaled Haddad',   slug: 'khaled-haddad' },
      { name: 'Issa Al Alem',    slug: 'issa-al-alem' },
      { name: 'Osaid Al Hiari',  slug: 'osaid-al-hiari' },
    ],
  },
  {
    key: 'ops',
    icon: ClipboardList,
    members: [
      { name: 'Suflan Haddad',      slug: 'suflan-haddad' },
      { name: 'Anas Al Hasasneh',   slug: 'anas-al-hasasneh' },
      { name: 'Ahmad Abu Sonbul',   slug: 'ahmad-abu-sonbul' },
    ],
  },
  {
    key: 'maintenance',
    icon: Wrench,
    members: [
      { name: 'Baker Azazmeh', slug: 'baker-azazmeh' },
    ],
  },
  {
    key: 'sales',
    icon: BadgeDollarSign,
    members: [
      { name: 'Jawad Abu Sael',   slug: 'jawad-abu-sael' },
      { name: 'Ramzi Abu Sonbul', slug: 'ramzi-abu-sonbul' },
    ],
  },
  {
    key: 'finance',
    icon: Coins,
    members: [
      { name: 'Diab Badwieh',   slug: 'diab-badwieh' },
      { name: 'Mahmoud Sonbul', slug: 'mahmoud-sonbul' },
      { name: 'Hamzeh Kharaz',  slug: 'hamzeh-kharaz' },
    ],
  },
];

function initials(name: string) {
  return name
    .replace(/^(Mr\.|Eng\.|Ms\.)\s+/i, '')
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface Props {
  lang: Lang;
}

export default function Team({ lang }: Props) {
  const { t } = useLocale(lang);
  const href = (path: string) => localizedHref(path, lang);

  return (
    <>
      <PageHero
        eyebrow={t('team.hero.eyebrow')}
        title={t('team.hero.title')}
        subtitle={t('team.hero.subtitle')}
      />

      {/* Leadership */}
      <section className="section">
        <div className="container-page">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow">{t('team.leadership')}</span>
            <h2 className="heading-lg mt-3">{t('team.leadershipTitle')}</h2>
            <p className="lead mt-4">{t('team.leadershipSubtitle')}</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {leadership.map((l, i) => (
              <Reveal key={l.name} delay={i * 0.08}>
                <a
                  href={href(`/team/${l.slug}`)}
                  className="card text-center p-7 flex flex-col items-center hover:shadow-soft hover:-translate-y-1 transition-all duration-300 group h-full"
                >
                  <div className="relative inline-flex">
                    {l.photo ? (
                      <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                        <img src={l.photo} alt={l.name} className="h-full w-full object-cover object-top" />
                      </div>
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary-700 text-white flex items-center justify-center text-2xl font-bold">
                        {initials(l.name)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-ink text-white flex items-center justify-center shadow-sm">
                      <l.icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="mt-5 font-semibold text-lg">{l.name}</h3>
                  <p className="mt-1 text-sm text-primary font-medium">{t(`team.roles.${l.roleKey}`)}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-ink/40 group-hover:text-primary transition-colors">
                    {t('teamMember.viewProfile')}
                    <ArrowRight className="h-3 w-3 rtl-flip" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section bg-sand">
        <div className="container-page">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow">{t('team.departments')}</span>
            <h2 className="heading-lg mt-3">{t('team.departmentsTitle')}</h2>
            <p className="lead mt-4">{t('team.departmentsSubtitle')}</p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((d, i) => (
              <Reveal key={d.key} delay={i * 0.06}>
                <article className="card p-7 h-full hover:shadow-soft transition-all duration-300">
                  {/* Department header */}
                  <div className="flex items-center gap-3 mb-6 pb-5 border-b border-ink-100">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                      <d.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-lg">{t(`team.roles.${d.key}`)}</h3>
                  </div>

                  {/* Members grid — each is a clickable link */}
                  <ul className="grid grid-cols-2 gap-5">
                    {d.members.map((m) => (
                      <li key={m.name}>
                        <a
                          href={href(`/team/${m.slug}`)}
                          className="flex flex-col items-center text-center gap-2.5 group"
                        >
                          {m.photo ? (
                            <img
                              src={m.photo}
                              alt={m.name}
                              className="h-20 w-20 rounded-full object-cover border-2 border-primary/20 shadow-sm group-hover:border-primary/60 group-hover:shadow-md transition-all"
                            />
                          ) : (
                            <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-ink/8 text-ink-600 text-lg font-bold border border-ink-100 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all">
                              {initials(m.name)}
                            </span>
                          )}
                          <span className="text-xs font-medium text-ink-700 leading-tight group-hover:text-primary transition-colors">
                            {m.name}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

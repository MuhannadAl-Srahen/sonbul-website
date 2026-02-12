import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2, Building2, Download } from 'lucide-react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import SEO from '../components/util/SEO';
import LogoBrand from '../components/ui/LogoBrand';
import Reveal from '../components/ui/Reveal';
import { getProfile } from '../data/teamProfiles';

function initials(name: string) {
  return name
    .replace(/^(Mr\.|Eng\.|Ms\.)\s+/i, '')
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function TeamMember() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const profile = getProfile(slug ?? '');

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [downloading, setDownloading] = useState(false);

  const profileUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://abusonbul-transporters.com/team/${slug}`;

  // Generate QR code client-side (no CORS issues when downloading)
  useEffect(() => {
    QRCode.toDataURL(profileUrl, {
      width: 240,
      margin: 1,
      color: { dark: '#1A1A1A', light: '#FFFFFF' },
    }).then(setQrDataUrl);
  }, [profileUrl]);

  useEffect(() => {
    if (!profile) navigate('/team', { replace: true });
  }, [profile, navigate]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${profile?.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() ?? 'staff'}-id.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } finally {
      setDownloading(false);
    }
  }, [profile]);

  if (!profile) return null;

  const isAr = i18n.language === 'ar';
  const bio = isAr && profile.arBio ? profile.arBio : profile.bio;

  const deptLabel =
    profile.departmentKey === 'leadership'
      ? t('brand.full')
      : t(`team.roles.${profile.departmentKey}`);

  return (
    <>
      <SEO
        title={`${profile.name} — ${t('brand.full')}`}
        description={profile.bio[0]}
      />

      {/* ── Dark hero ────────────────────────────────── */}
      <section className="relative bg-ink overflow-hidden -mt-20 flex flex-col justify-end min-h-[50vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-ink-800" />
        <div className="absolute inset-0 grain opacity-15" aria-hidden />
        <div className="absolute -top-32 -end-32 h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl pointer-events-none" aria-hidden />
        <div className="absolute bottom-0 start-0 end-0 h-1 bg-primary" />

        <div className="relative container-page pb-12 sm:pb-14 pt-28 sm:pt-44">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 text-white/45 hover:text-white/90 text-sm mb-10 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 rtl-flip group-hover:-translate-x-1 transition-transform" />
            {t('nav.team')}
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-7">
            <div className="flex-shrink-0">
              {profile.photo ? (
                <div className="h-28 w-28 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-2xl">
                  <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover object-top" />
                </div>
              ) : (
                <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-primary to-primary-700 text-white flex items-center justify-center text-3xl font-bold border-2 border-primary/40 shadow-2xl">
                  {initials(profile.name)}
                </div>
              )}
            </div>

            <div>
              <span className="inline-flex items-center gap-2 text-primary-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                {deptLabel}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                {profile.name}
              </h1>
              <p className="mt-2 text-primary text-lg font-semibold">
                {t(`team.roles.${profile.roleKey}`)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────── */}
      <section className="section">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-10 items-start">

            {/* Bio — left 2 cols */}
            <div className="lg:col-span-2">
              <Reveal>
                <h2 className="heading-lg mb-8 flex items-center gap-4">
                  <span className="h-1 w-10 bg-primary inline-block rounded-full flex-shrink-0" />
                  {t('teamMember.profileTitle')}
                </h2>
              </Reveal>
              <ul className="space-y-5">
                {bio.map((point, i) => (
                  <Reveal key={i} delay={i * 0.05}>
                    <li className="flex gap-4">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-ink-700 leading-relaxed">{point}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>

            {/* Digital ID Card — right 1 col */}
            <div className="lg:col-span-1 max-w-sm mx-auto w-full lg:max-w-none lg:mx-0">
              <Reveal>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="heading-lg flex items-center gap-4">
                    <span className="h-1 w-10 bg-primary inline-block rounded-full flex-shrink-0" />
                    {t('teamMember.idTitle')}
                  </h2>
                  <button
                    onClick={handleDownload}
                    disabled={downloading || !qrDataUrl}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex-shrink-0"
                    title={t('teamMember.downloadId')}
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('teamMember.downloadId')}</span>
                  </button>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                {/* This ref is what html2canvas captures */}
                <div ref={cardRef} className="rounded-2xl overflow-hidden shadow-2xl">
                  {/* Card top bar */}
                  <div className="bg-ink px-5 py-4 flex items-center justify-between">
                    <LogoBrand dark className="h-7" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 flex-shrink-0">
                      Staff ID
                    </span>
                  </div>
                  {/* Red accent strip */}
                  <div className="h-1 bg-primary" />

                  {/* Card body */}
                  <div className="bg-ink/95 px-6 py-7 flex flex-col items-center gap-5 text-center">
                    {/* Photo / initials — bigger than before */}
                    {profile.photo ? (
                      <div className="h-36 w-36 rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg">
                        <img
                          src={profile.photo}
                          alt={profile.name}
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div className="h-36 w-36 rounded-xl bg-gradient-to-br from-primary to-primary-700 text-white flex items-center justify-center text-4xl font-bold border-2 border-primary/30 shadow-lg">
                        {initials(profile.name)}
                      </div>
                    )}

                    {/* Name + role */}
                    <div className="space-y-1">
                      <div className="text-white font-bold text-lg leading-snug">
                        {profile.name}
                      </div>
                      <div className="text-primary text-sm font-semibold">
                        {t(`team.roles.${profile.roleKey}`)}
                      </div>
                      <div className="text-white/35 text-xs">
                        Abu Sonbul Arab Transporters
                      </div>
                    </div>

                    {/* QR Code — use data URL generated client-side */}
                    {qrDataUrl ? (
                      <>
                        <div className="bg-white rounded-xl p-3 shadow-md">
                          <img
                            src={qrDataUrl}
                            alt="Profile QR Code"
                            className="h-[130px] w-[130px] block"
                          />
                        </div>
                        <p className="text-white/30 text-[10px] uppercase tracking-widest -mt-1">
                          {t('teamMember.scanLabel')}
                        </p>
                      </>
                    ) : (
                      <div className="h-[150px] w-[150px] rounded-xl bg-white/5 animate-pulse" />
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="bg-primary px-5 py-3 text-center">
                    <p className="text-white/80 text-xs font-semibold tracking-wide">
                      abusonbul-transporters.com
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Back button */}
          <div className="mt-16 pt-8 border-t border-ink-100">
            <Link
              to="/team"
              className="inline-flex items-center gap-2 text-ink/50 hover:text-primary font-semibold transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 rtl-flip group-hover:-translate-x-1 transition-transform" />
              {t('teamMember.backToTeam')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

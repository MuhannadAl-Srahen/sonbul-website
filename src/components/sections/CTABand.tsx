import { ArrowRight } from 'lucide-react';
import Reveal from '../ui/Reveal';

interface Props {
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  badge?: string;
}

/** The dark rounded call-to-action that existed in three near-identical copies. */
export default function CTABand({ title, subtitle, cta, badge }: Props) {
  return (
    <section className="section-tight">
      <div className="container-page">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center sm:px-14">
            <h2 className="heading-lg !text-white">{title}</h2>
            <p className="lead mx-auto mt-4 max-w-2xl !text-white/70">{subtitle}</p>
            <a href={cta.href} className="btn-primary mt-8">
              {cta.label}
              <ArrowRight className="h-4 w-4 rtl-flip" />
            </a>
            {badge && <p className="mt-6 text-xs uppercase tracking-wider text-white/40">{badge}</p>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

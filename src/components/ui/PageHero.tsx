import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  children?: ReactNode;
}

export default function PageHero({ eyebrow, title, subtitle, image, children }: Props) {
  return (
    /* -mt-20 pulls this section behind the sticky header (h-20),
       so the transparent/blur header sits on top of the dark hero — same effect as home page. */
    <section className="relative overflow-hidden min-h-[46vh] sm:min-h-[58vh] flex flex-col justify-end bg-ink -mt-20">
      {/* Background */}
      {image ? (
        <div className="absolute inset-0">
          <img src={image} alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/72 to-ink/35" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-800 to-ink-700" />
      )}
      <div className="absolute inset-0 grain opacity-15 pointer-events-none" aria-hidden />

      {/* Red accent line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />

      {/* pt-44 = 20 (header) + 24 (original padding) = content sits exactly where it did before */}
      <div className="relative container-page pb-12 sm:pb-14 pt-28 sm:pt-44">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-primary-300 mb-4">
            <span className="h-[2px] w-6 bg-primary inline-block" />
            {eyebrow}
          </span>
          <h1 className="page-hero-title text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] !text-white mt-2 hero-text-shadow">{title}</h1>
          {subtitle && (
            <p className="mt-5 text-lg md:text-xl !text-white/90 leading-relaxed max-w-2xl hero-text-shadow">{subtitle}</p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}

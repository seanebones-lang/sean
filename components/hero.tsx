"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";

type HeroProps = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaBooking: string;
  ctaPortfolio: string;
  stats: string[];
  videoUrl?: string | null;
  videoPoster?: string | null;
};

export function Hero({
  eyebrow,
  headline,
  subheadline,
  ctaBooking,
  ctaPortfolio,
  stats,
  videoUrl,
  videoPoster,
}: HeroProps) {
  const reduced = useReducedMotion();

  return (
    <section className="grid min-w-0 gap-8 py-8 min-[480px]:py-12 md:grid-cols-[1.2fr_1fr] md:py-16">
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-[0.25em] text-electric">{eyebrow}</p>
        <h1 className="section-title mt-3 break-words text-[clamp(2.25rem,8vw,3.75rem)] leading-[0.92] text-foreground min-[480px]:mt-4">
          {headline}
        </h1>
        <div className="mt-4 max-w-2xl space-y-4 text-base leading-relaxed text-muted-foreground min-[480px]:mt-5 min-[480px]:text-lg min-[480px]:leading-8">
          {subheadline
            .split(/\n\n+/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>

        <div className="mt-6 flex w-full min-w-0 flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap sm:mt-8">
          <Link
            href="/booking"
            className="electric-ring flex min-h-12 touch-manipulation items-center justify-center rounded-full border border-electric px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-foreground hover:text-electric min-[420px]:flex-1 min-[420px]:px-6 sm:flex-none sm:tracking-[0.16em]"
          >
            {ctaBooking}
          </Link>
          <Link
            href="/portfolio"
            className="flex min-h-12 touch-manipulation items-center justify-center rounded-full border border-border px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-foreground hover:border-electric min-[420px]:flex-1 min-[420px]:px-6 sm:flex-none sm:tracking-[0.16em]"
          >
            {ctaPortfolio}
          </Link>
        </div>

        <div className="mt-6 grid gap-3 min-[480px]:mt-8 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item} className="section-card rounded-xl px-3 py-4 text-center text-sm">
              {item}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={reduced ? undefined : { opacity: 0, scale: 0.98 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
        className="relative min-h-0"
      >
        <div className="relative h-[min(42dvh,20rem)] w-full min-h-[200px] overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface/80 to-black min-[480px]:h-[min(44dvh,22rem)] md:h-[320px] md:min-h-[320px]">
          <div
            className="pointer-events-none absolute inset-0 z-[1] rounded-2xl bg-[radial-gradient(ellipse_at_60%_40%,#21c7ff14_0%,transparent_70%)]"
            aria-hidden
          />
          {videoUrl ? (
            <video
              src={videoUrl}
              poster={videoPoster ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Studio highlights"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <Image
              src="/sean-hero.jpg"
              alt="Sean E. Bones"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center"
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}

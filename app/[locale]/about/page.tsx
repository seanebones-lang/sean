import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/page-shell";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  email: siteConfig.email,
  description: "Tattoo artist tattooing professionally since 2004. Sponsored artist specializing in black and grey realism, fine line, and custom illustrative work.",
  knowsAbout: ["Tattoo", "Black and grey realism", "Fine line tattoo", "Cover-up tattoo", "Custom illustrative tattoo"],
  hasOccupation: {
    "@type": "Occupation",
    name: "Tattoo Artist",
    startDate: "2004",
    occupationLocation: { "@type": "Country", name: "United States" },
    skills: "Black and grey realism, fine line, script, illustrative, traditional, cover-ups",
  },
  sameAs: [siteConfig.instagram, siteConfig.facebook].filter(Boolean),
};

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "About Cody Meneley",
    description: "Tattooing professionally since 2004. Sponsored artist specializing in black and grey realism, fine line, and custom illustrative work.",
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/about` },
    openGraph: {
      title: "About Cody Meneley",
      description: "20+ years of professional tattooing. Sponsored artist, black and grey specialist, custom designs.",
      url: `${siteConfig.siteUrl}/${locale}/about`,
    },
  };
}

const stats = [
  { value: "20+", label: "Years tattooing" },
  { value: "3,000+", label: "Pieces completed" },
  { value: "2004", label: "Tattooing since" },
  { value: "Sponsored", label: "Artist status" },
];

const workflow = [
  {
    step: "01",
    heading: "Consultation",
    body: "Every project starts with a conversation — concept, placement, size, and long-term vision. Custom designs are refined until they're exactly right before a single needle touches skin.",
  },
  {
    step: "02",
    heading: "Design & placement",
    body: "Composition is planned to complement your body's contours and age well over time. Stencil placement is reviewed together before committing.",
  },
  {
    step: "03",
    heading: "The session",
    body: "A focused, relaxed environment. Work is paced to maintain skin quality and your comfort. Music, breaks, and communication are always part of the experience.",
  },
  {
    step: "04",
    heading: "Healed result",
    body: "Aftercare guidance is included. The goal is a piece that looks as good healed as it did fresh — that means proper technique and product from the start.",
  },
];

const specialties = [
  "Black & grey realism",
  "Fine line",
  "Custom illustrative",
  "Script & lettering",
  "Traditional & neo-trad",
  "Cover-ups & reworks",
];

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
    />
    <PageShell
      title="About Cody"
      description="Cody Meneley has tattooed professionally since 2004. Sponsored artist, versatile across styles, with black and grey as a signature specialty."
    >
      {/* By the numbers */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="section-card rounded-xl px-4 py-5 text-center">
            <p className="section-title text-2xl text-electric sm:text-3xl">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* About text */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <article className="section-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground">Craft First</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every project begins with concept refinement, placement planning, and a composition
            strategy that fits your body and long-term vision. The goal isn't just a tattoo that
            looks great on day one — it's artwork that ages with you.
          </p>
        </article>
        <article className="section-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground">All Styles Welcome</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Fine line, realism, script, traditional, illustrative, and custom hybrids are all
            part of the workflow. The common thread is clean execution and intentional design —
            not chasing trends, but building pieces with longevity.
          </p>
        </article>
      </div>

      {/* Specialties */}
      <div className="mt-8">
        <h2 className="section-title text-sm text-muted-foreground">Specialties</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {specialties.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mt-10">
        <h2 className="section-title text-lg text-foreground">How a session works</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {workflow.map((w) => (
            <div key={w.step} className="section-card rounded-xl p-5">
              <p className="section-title text-3xl text-electric/30">{w.step}</p>
              <p className="mt-2 font-semibold text-foreground">{w.heading}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/portfolio"
          className="electric-ring rounded-full border border-electric px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground hover:text-electric"
        >
          View portfolio
        </Link>
        <Link
          href="/booking"
          className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:border-electric/40 hover:text-electric"
        >
          Book a consultation
        </Link>
      </div>
    </PageShell>
    </>
  );
}

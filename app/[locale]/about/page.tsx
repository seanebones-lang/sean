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
  description:
    "Tattoo artist since 1999; apprenticed under Troy \"Rabbit\" Fox in Fort Worth and Duncanville, Texas. Internationally published, award winning art. Based in Mansfield, Texas — appointment only.",
  knowsAbout: [
    "Tattoo",
    "Custom tattoo",
    "Internationally published tattoo art",
    "Award winning tattoo art",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Tattoo Artist",
    startDate: "1999",
    occupationLocation: {
      "@type": "Place",
      name: "Mansfield",
      containedInPlace: { "@type": "AdministrativeArea", name: "Texas" },
    },
    skills: "Custom tattooing across multiple styles; career work in Texas, New Mexico, Missouri, and Kansas",
  },
  sameAs: [siteConfig.instagram, siteConfig.facebook].filter(Boolean),
};

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "About Sean E Bones",
    description:
      "Sean E Bones has tattooed professionally since 1999, apprenticed under Troy \"Rabbit\" Fox, and creates internationally published, award winning art — now based in Mansfield, TX — appointment only.",
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/about` },
    openGraph: {
      title: "About Sean E Bones",
      description:
        "From Fort Worth and Duncanville roots to Mansfield today — internationally published, award winning art, by appointment.",
      url: `${siteConfig.siteUrl}/${locale}/about`,
    },
  };
}

const stats = [
  { value: "1999", label: "Tattooing professionally since" },
  { value: "Internationally published", label: "Award winning art" },
  { value: "TX · NM · MO · KS", label: "States Sean has tattooed in" },
  { value: "Mansfield", label: "Texas — appointment only" },
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

const aboutIntro =
  "Sean has been tattooing professionally since 1999. He apprenticed under Troy \"Rabbit\" Fox in Fort Worth and Duncanville, Texas. He is an internationally published, award-winning artist who has tattooed in Texas, New Mexico, Missouri, and Kansas. He is currently based in Mansfield, Texas, and is available by appointment only.";

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
    />
    <PageShell title="About Sean" description={aboutIntro}>
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
          <h2 className="text-xl font-semibold text-foreground">Apprenticeship & roots</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Sean learned the trade under{" "}
            <span className="text-foreground">Troy &quot;Rabbit&quot; Fox</span> in Fort Worth and
            Duncanville, Texas — a foundation in classic shop discipline, client care, and
            technical fundamentals he still carries into every session.
          </p>
        </article>
        <article className="section-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground">Today in Mansfield</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            After years of tattooing across Texas, New Mexico, Missouri, and Kansas, Sean is
            settled in Mansfield, Texas. His work has been published internationally and recognized
            in competition — and he takes new projects{" "}
            <span className="text-foreground">by appointment only</span>, so every booking gets the
            time and attention it deserves.
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

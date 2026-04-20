import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageShell } from "@/components/page-shell";
import { PortfolioPieceCard } from "@/components/portfolio-piece-card";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import {
  getPortfolioByStyle,
  getStyleTags,
  resolveStyleTag,
} from "@/lib/sanity/portfolio";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const tags = await getStyleTags();
  return tags.flatMap((t) => [
    { locale: "en", slug: t.slug },
    { locale: "es", slug: t.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const tag = await resolveStyleTag(slug);
  if (!tag) return {};
  const title = `${tag.label} Tattoos — Portfolio`;
  const description = `Custom ${tag.label.toLowerCase()} tattoos by Sean E Bones. Browse pieces, see common placements, and start a session.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/portfolio/style/${slug}` },
    openGraph: {
      title: `${tag.label} Tattoos — Sean E Bones`,
      description,
      url: `${siteConfig.siteUrl}/${locale}/portfolio/style/${slug}`,
    },
  };
}

const STYLE_COPY: Record<string, { intro: string; faqs: { q: string; a: string }[] }> = {
  "fine-line": {
    intro:
      "Fine line tattoos focus on delicate, single-needle work with high precision. They read as soft and elegant up close, and hold up best in places with even skin tension — inner forearm, upper back, calf.",
    faqs: [
      {
        q: "How long do fine line tattoos last?",
        a: "With good aftercare and sun protection, fine line tattoos age gracefully for decades. Touch-ups every 5–7 years keep the line quality sharp.",
      },
      {
        q: "Are fine line tattoos more painful?",
        a: "Usually less than heavy saturation work — fewer passes, less trauma. Placement matters more than the style itself.",
      },
    ],
  },
  "black-and-grey": {
    intro:
      "Black and grey blends deep blacks with diluted washes to create depth, realism, and shading without color. It's the most versatile style for realism, portraits, and illustrative work.",
    faqs: [
      {
        q: "How does black and grey age?",
        a: "Very well — with UV protection, the midtones stay crisp for 15+ years. Greywash can soften slightly, which many clients prefer.",
      },
      {
        q: "Can black and grey include light color accents?",
        a: "Yes — single accent colors (like a rose or flame tip) are common and pair well with heavy black and grey work.",
      },
    ],
  },
  realism: {
    intro:
      "Realism tattooing reproduces photos, portraits, and natural details with painterly depth. It requires long sessions and is best in spots with even skin and low wear.",
    faqs: [
      {
        q: "How many sessions do realism pieces take?",
        a: "Most palm-to-forearm realism pieces take 2–3 sessions. Full sleeves and back pieces take 5+.",
      },
      {
        q: "Do you need a reference photo?",
        a: "Yes — bring the highest-resolution reference you can. Composite references work too; we refine the final design together.",
      },
    ],
  },
  traditional: {
    intro:
      "American traditional tattoos use bold lines, limited solid color, and classic iconography. Built to read from across the room and age beautifully for a lifetime.",
    faqs: [
      {
        q: "Why are traditional tattoos so bold?",
        a: "Thick outlines and solid saturation are what let the design stay readable for 30+ years. It's a style built on legibility.",
      },
    ],
  },
};

export default async function StyleLandingPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tag = await resolveStyleTag(slug);
  if (!tag) notFound();

  const pieces = await getPortfolioByStyle(tag.label);
  const copy = STYLE_COPY[slug] ?? {
    intro: `Custom ${tag.label.toLowerCase()} work by Sean E Bones — see recent pieces below and start a quick quote for your concept.`,
    faqs: [],
  };

  return (
    <>
      <Breadcrumbs
        locale={locale}
        items={[
          { label: "Home", href: "/" },
          { label: "Portfolio", href: "/portfolio" },
          { label: tag.label },
        ]}
      />
      <PageShell
        title={`${tag.label} Tattoos`}
        description={copy.intro}
      >
        {pieces.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pieces.map((piece, i) => (
              <Link key={piece._id} href={`/portfolio/${piece.slug}`} className="group">
                <PortfolioPieceCard
                  title={piece.title}
                  description={piece.description}
                  styleTags={piece.styleTags}
                  image={
                    piece.images?.find(Boolean) ??
                    piece.image ??
                    piece.mainImage ??
                    piece.healedImage ??
                    null
                  }
                  featured={piece.featured ?? false}
                  priority={i < 3}
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            New {tag.label.toLowerCase()} pieces land in the{" "}
            <Link href="/portfolio" className="text-electric hover:underline">full portfolio</Link>{" "}
            first. Start a quote and we&apos;ll match your concept to past work.
          </p>
        )}

        {copy.faqs.length > 0 ? (
          <section className="mt-12">
            <h2 className="section-title mb-4 text-xl text-foreground">FAQ — {tag.label}</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              {copy.faqs.map((item) => (
                <div key={item.q} className="section-card rounded-xl p-4">
                  <dt className="text-sm font-semibold text-foreground">{item.q}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section className="mt-12">
          <div className="section-card flex flex-col items-center gap-4 rounded-2xl px-6 py-8 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <h2 className="section-title text-xl text-foreground">
                Thinking about a {tag.label.toLowerCase()} piece?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Start a quick quote — we&apos;ll pre-fill the style so Sean can estimate your project faster.
              </p>
            </div>
            <Link
              href={`/booking?style=${encodeURIComponent(tag.label)}`}
              className="electric-ring inline-flex touch-manipulation items-center justify-center rounded-full border border-electric px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-foreground hover:text-electric"
            >
              Start quote
            </Link>
          </div>
        </section>
      </PageShell>
    </>
  );
}

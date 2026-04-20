import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageShell } from "@/components/page-shell";
import { PortfolioPieceCard } from "@/components/portfolio-piece-card";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { getCoverUpPortfolio } from "@/lib/sanity/portfolio";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Cover-Up Tattoos",
    description:
      "Cover-up and rework tattoos by Sean E Bones — turn an old piece, scar, or regret into custom work. Before-after examples and a straightforward process.",
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/portfolio/cover-ups` },
    openGraph: {
      title: "Cover-Up Tattoos — Sean E Bones",
      description:
        "Cover-ups and reworks handled case-by-case. Before-and-after examples, process, and honest expectations.",
      url: `${siteConfig.siteUrl}/${locale}/portfolio/cover-ups`,
    },
  };
}

export default async function CoverUpsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pieces = await getCoverUpPortfolio();
  const featured = pieces.find((p) => p.healedImage && (p.images?.[0] || p.mainImage));

  return (
    <>
      <Breadcrumbs
        locale={locale}
        items={[
          { label: "Home", href: "/" },
          { label: "Portfolio", href: "/portfolio" },
          { label: "Cover-Ups" },
        ]}
      />
      <PageShell
        title="Cover-Up Tattoos"
        description="Old tattoos, faded work, scar cover, or pieces you've outgrown — reworked into something you'll want to show off. Every case is evaluated individually before booking."
      >
        {featured ? (
          <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
            <BeforeAfterSlider
              beforeSrc={urlFor(featured.images?.[0] ?? featured.mainImage!)
                .width(1200)
                .height(1500)
                .quality(85)
                .format("webp")
                .url()}
              afterSrc={urlFor(featured.healedImage!)
                .width(1200)
                .height(1500)
                .quality(85)
                .format("webp")
                .url()}
              beforeLabel="Original"
              afterLabel="Covered"
              alt={featured.title}
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Featured cover-up</p>
              <h2 className="section-title mt-1 text-2xl text-foreground">{featured.title}</h2>
              {featured.description ? (
                <p className="mt-3 text-sm text-muted-foreground">{featured.description}</p>
              ) : null}
              {featured.slug ? (
                <Link
                  href={`/portfolio/${featured.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-electric hover:underline"
                >
                  See full piece →
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        <section className="mb-10">
          <h2 className="section-title mb-3 text-xl text-foreground">How a cover-up works</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: 1, title: "Send a photo", body: "Clear, well-lit photo of the current tattoo from 2 different angles." },
              { n: 2, title: "Honest assessment", body: "Not every piece can be covered in one pass. You'll get straight answers." },
              { n: 3, title: "Custom design", body: "A concept is built specifically to absorb the old ink — usually bolder, darker, more saturated." },
              { n: 4, title: "Session(s) booked", body: "Most cover-ups finish in 1–2 sessions. Complex pieces may need a laser session first." },
            ].map((step) => (
              <li key={step.n} className="section-card rounded-xl p-5">
                <p className="text-xs uppercase tracking-widest text-electric">Step {step.n}</p>
                <p className="mt-1 font-semibold text-foreground">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {pieces.length > 0 ? (
          <section>
            <h2 className="section-title mb-4 text-xl text-foreground">Cover-up gallery</h2>
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
          </section>
        ) : (
          <p className="text-sm text-muted-foreground">
            New cover-up work is always being added — send a photo of your existing piece via the
            {" "}
            <Link href="/contact" className="text-electric hover:underline">contact page</Link>
            {" "}and Sean will tell you what&apos;s possible.
          </p>
        )}

        <section className="mt-12">
          <div className="section-card flex flex-col items-center gap-4 rounded-2xl px-6 py-8 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <h2 className="section-title text-xl text-foreground">Ready to cover an old tattoo?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Send clear photos with your quote. Sean reviews every case personally.
              </p>
            </div>
            <Link
              href="/booking?style=Cover-up"
              className="electric-ring inline-flex touch-manipulation items-center justify-center rounded-full border border-electric px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-foreground hover:text-electric"
            >
              Start cover-up quote
            </Link>
          </div>
        </section>
      </PageShell>
    </>
  );
}

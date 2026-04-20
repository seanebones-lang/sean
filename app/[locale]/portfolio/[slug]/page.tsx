import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { urlFor } from "@/sanity/lib/image";
import { PortfolioPieceCard } from "@/components/portfolio-piece-card";
import { BookingCta } from "@/components/booking-cta";
import { ImageGallery } from "@/components/image-gallery";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ShareButtons } from "@/components/share-buttons";
import { getPortfolioPieceBySlug, getPortfolioPieceSlugs } from "./piece-data";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPortfolioPieceSlugs();
  return slugs.flatMap(({ slug }) => [
    { locale: "en", slug },
    { locale: "es", slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const result = await getPortfolioPieceBySlug(slug);
  if (!result.ok) return {};

  const { piece } = result;
  const title = `${piece.title} | Tattoo Portfolio`;
  const description =
    piece.description?.slice(0, 160) ??
    `Tattoo work: ${piece.title}${piece.styleTags?.length ? ` — ${piece.styleTags.join(", ")}` : ""}`;

  const firstImage = piece.images?.[0];
  const imageUrl = firstImage
    ? urlFor(firstImage).width(1200).height(630).format("webp").url()
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630 }] } : {}),
    },
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/portfolio/${slug}`,
      languages: {
        en: `${siteConfig.siteUrl}/en/portfolio/${slug}`,
        es: `${siteConfig.siteUrl}/es/portfolio/${slug}`,
      },
    },
  };
}

export default async function PortfolioPiecePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const result = await getPortfolioPieceBySlug(slug);
  if (!result.ok) notFound();

  const { piece, related } = result;

  const images = piece.images ?? [];
  const imageUrls = images.map((img) => ({
    src: urlFor(img).width(1200).height(1500).format("webp").quality(90).url(),
    thumb: urlFor(img).width(400).height(500).format("webp").quality(80).url(),
    alt: piece.title,
  }));

  const healedUrl = piece.healedImage
    ? urlFor(piece.healedImage).width(1200).height(1500).format("webp").quality(90).url()
    : null;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: piece.title,
    description: piece.description ?? undefined,
    creator: piece.artist ? { "@type": "Person", name: piece.artist.name } : undefined,
    keywords: piece.styleTags?.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
        <Breadcrumbs
          locale={locale}
          items={[
            { label: "Home", href: "/" },
            { label: "Portfolio", href: "/portfolio" },
            { label: piece.title },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          {/* Gallery */}
          <div className="min-w-0">
            <ImageGallery images={imageUrls} healedUrl={healedUrl} title={piece.title} />
          </div>

          {/* Info sidebar */}
          <div className="space-y-6">
            <div>
              <h1 className="section-title text-[clamp(1.75rem,5vw,2.5rem)] leading-none text-foreground">
                {piece.title}
              </h1>

              {piece.styleTags?.length || piece.placement ? (
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Style tags">
                  {piece.placement ? (
                    <li className="rounded-full border border-electric/30 bg-electric/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-electric">
                      {piece.placement}
                    </li>
                  ) : null}
                  {piece.styleTags?.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}

              {piece.publishedAt ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(piece.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              ) : null}

              {piece.description ? (
                <p className="mt-4 leading-relaxed text-muted-foreground">{piece.description}</p>
              ) : null}
            </div>

            {/* Artist attribution */}
            {piece.artist ? (
              <div className="section-card rounded-xl p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Artist</p>
                <Link
                  href={`/artists/${piece.artist.slug}`}
                  className="mt-1 flex items-center gap-2 hover:text-electric"
                >
                  <span className="font-semibold text-foreground">{piece.artist.name}</span>
                  <span className="text-electric">→</span>
                </Link>
                {piece.artist.specialties?.length ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {piece.artist.specialties.slice(0, 3).join(" · ")}
                  </p>
                ) : null}
                {piece.artist.availabilityStatus === "open" ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
                    Booking open
                  </span>
                ) : piece.artist.availabilityStatus === "waitlist" ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
                    Waitlist
                  </span>
                ) : null}
              </div>
            ) : null}

            <BookingCta />

            {/* Share */}
            <div className="section-card rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Share</p>
              <div className="mt-2">
                <ShareButtons
                  url={`${siteConfig.siteUrl}/${locale}/portfolio/${piece.slug}`}
                  title={piece.title}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Related pieces */}
        {related.length > 0 ? (
          <section className="mt-16">
            <h2 className="section-title mb-6 text-xl text-foreground">Related Work</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 6).map((rel) => (
                <Link key={rel._id} href={`/portfolio/${rel.slug}`}>
                  <PortfolioPieceCard
                    title={rel.title}
                    styleTags={rel.styleTags}
                    image={rel.images?.[0] ?? null}
                  />
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}

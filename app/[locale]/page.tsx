import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Hero } from "@/components/hero";
import { MobileBookCta } from "@/components/mobile-book-cta";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { getAggregateRating } from "@/lib/sanity/testimonials";
import { sanityClient } from "@/sanity/lib/client";
import { recentFeaturedQuery, sponsorPartnersQuery } from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

type RecentPiece = {
  _id: string;
  title: string;
  slug: string | null;
  styleTags?: string[] | null;
  images?: SanityImageSource[] | null;
};

type SponsorPartner = {
  _id: string;
  name: string;
  logo?: SanityImageSource | null;
  url?: string | null;
};

async function getRecentPieces(): Promise<RecentPiece[]> {
  if (!sanityEnv.isConfigured) return [];
  try {
    const res = await sanityClient.fetch<RecentPiece[]>(
      recentFeaturedQuery,
      {},
      { next: { revalidate: 60 } }
    );
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

async function getSponsorPartners(): Promise<SponsorPartner[]> {
  if (!sanityEnv.isConfigured) return [];
  try {
    const res = await sanityClient.fetch<SponsorPartner[]>(
      sponsorPartnersQuery,
      {},
      { next: { revalidate: 300 } }
    );
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const [agg, recent, sponsors] = await Promise.all([getAggregateRating(), getRecentPieces(), getSponsorPartners()]);

  const ratingValue = agg.average ? Number(agg.average.toFixed(1)) : null;

  const personLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Person", "LocalBusiness"],
    name: siteConfig.name,
    email: siteConfig.email,
    url: siteConfig.siteUrl,
    sameAs: [siteConfig.instagram, siteConfig.facebook].filter(Boolean),
    description: siteConfig.description,
    knowsAbout: [
      "Tattoo",
      "Black and grey tattoo",
      "Tattoo design",
      "Realism tattoo",
      "Fine line tattoo",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Tattoo Artist",
      occupationLocation: { "@type": "Country", name: "United States" },
    },
    additionalType: "https://schema.org/ProfessionalService",
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card",
    openingHours: "By appointment",
    areaServed: "United States",
  };

  if (ratingValue && agg.count > 0) {
    personLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount: agg.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  const servicesLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Tattoo Services",
    provider: { "@type": "Person", name: siteConfig.name },
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom Tattoo Design & Application",
          description: "Original custom tattoo designs tailored to your concept, placement, and style preferences.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Black and Grey Realism",
          description: "Tonal realism work with depth and contrast — portraits, illustrative, and detailed compositions.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Cover-Up & Rework",
          description: "Cover-up or rework of existing tattoos including scars, evaluated case-by-case.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Tattoo Consultation",
          description: "Concept refinement, placement planning, and session structure consultation.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Touch-Up Sessions",
          description: "Follow-up touch-ups on previously completed tattoo work.",
        },
      },
    ],
  };

  return (
    <>
      <div className="mx-auto w-full max-w-6xl min-w-0 px-3 min-[480px]:px-4 sm:px-6">
        <Hero
          eyebrow={t("eyebrow")}
          headline={t("headline")}
          subheadline={t("subheadline")}
          ctaBooking={t("ctaBooking")}
          ctaPortfolio={t("ctaPortfolio")}
          stats={[t("statsA"), t("statsB"), t("statsC")]}
        />

        {/* Rating strip */}
        {ratingValue ? (
          <div className="section-card mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex text-electric" aria-label={`Rated ${ratingValue} out of 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} aria-hidden className={n <= Math.round(ratingValue) ? "" : "opacity-30"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="font-semibold text-foreground">{ratingValue.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                from {agg.count} client {agg.count === 1 ? "review" : "reviews"}
              </span>
            </div>
            <Link href="/testimonials" className="text-xs font-semibold uppercase tracking-widest text-electric hover:underline">
              Read testimonials →
            </Link>
          </div>
        ) : null}

        <section className="grid min-w-0 gap-4 pb-10 min-[480px]:pb-12 md:grid-cols-3">
          {[
            {
              title: "Black and Grey Specialty",
              body: "Depth-focused tonal work for realism, portraits, and bold contrast pieces.",
            },
            {
              title: "Full Style Coverage",
              body: "Fine line, script, illustrative, traditional, realism, and custom composition.",
            },
            {
              title: "Professional Process",
              body: "Consultation-first approach, clean studio standards, and clear healing guidance.",
            },
          ].map((item) => (
            <article key={item.title} className="section-card rounded-xl p-5">
              <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </section>

        {/* Sponsors strip */}
        {sponsors.length ? (
          <section className="pb-10">
            <p className="section-title mb-4 text-center text-xs text-muted-foreground">Sponsored by</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {sponsors.map((s) => (
                s.url ? (
                  <a
                    key={s._id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-electric"
                  >
                    {s.logo ? (
                      <Image
                        src={urlFor(s.logo).height(40).format("webp").url()}
                        alt={s.name}
                        width={80}
                        height={40}
                        className="h-8 w-auto object-contain opacity-60 hover:opacity-100"
                      />
                    ) : (
                      <span>{s.name}</span>
                    )}
                  </a>
                ) : (
                  <span key={s._id} className="text-sm text-muted-foreground">
                    {s.logo ? (
                      <Image
                        src={urlFor(s.logo).height(40).format("webp").url()}
                        alt={s.name}
                        width={80}
                        height={40}
                        className="h-8 w-auto object-contain opacity-60"
                      />
                    ) : s.name}
                  </span>
                )
              ))}
            </div>
          </section>
        ) : null}

        {/* Recent work preview */}
        {recent.length ? (
          <section className="pb-12">
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className="section-title text-xl text-foreground sm:text-2xl">Recent Work</h2>
              <Link
                href="/portfolio"
                className="text-xs font-semibold uppercase tracking-widest text-electric hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {recent.map((piece) => (
                <Link
                  key={piece._id}
                  href={`/portfolio/${piece.slug}`}
                  className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-gradient-to-br from-surface to-black"
                  aria-label={piece.title}
                >
                  {piece.images?.[0] ? (
                    <Image
                      src={urlFor(piece.images[0]).width(500).height(625).quality(80).format("webp").url()}
                      alt={piece.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                    <p className="truncate text-xs text-white">{piece.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
        {/* Bottom CTA strip */}
        <section className="pb-12">
          <div className="section-card flex flex-col items-center gap-5 rounded-2xl px-6 py-10 text-center sm:flex-row sm:text-left">
            <div className="flex-1 min-w-0">
              <h2 className="section-title text-xl text-foreground sm:text-2xl">Ready to start your project?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us your idea. Custom consultations are free — deposits hold your spot.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap justify-center gap-3 sm:justify-end">
              <Link
                href="/booking"
                className="electric-ring inline-flex touch-manipulation items-center justify-center rounded-full border border-electric px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-foreground hover:text-electric"
              >
                Book now
              </Link>
              <Link
                href="/contact"
                className="inline-flex touch-manipulation items-center justify-center rounded-full border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:border-electric/40 hover:text-electric"
              >
                Send a message
              </Link>
            </div>
          </div>
        </section>
      </div>

      <MobileBookCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesLd) }}
      />
    </>
  );
}

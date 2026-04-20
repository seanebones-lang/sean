import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Hero } from "@/components/hero";
import { MobileBookCta } from "@/components/mobile-book-cta";
import { Link } from "@/i18n/navigation";
import { getAggregateRating, getTestimonials } from "@/lib/sanity/testimonials";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { sanityClient } from "@/sanity/lib/client";
import { recentFeaturedQuery, sponsorPartnersQuery } from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import { getSiteSettings } from "@/lib/sanity/site-settings";
import { InstagramStrip } from "@/components/instagram-strip";
import { HomeStructuredData } from "@/components/home-structured-data";

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
  const [agg, recent, sponsors, testimonials, settings] = await Promise.all([
    getAggregateRating(),
    getRecentPieces(),
    getSponsorPartners(),
    getTestimonials(),
    getSiteSettings(),
  ]);

  const ratingValue = agg.average ? Number(agg.average.toFixed(1)) : null;

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
          videoUrl={settings?.heroVideoUrl ?? undefined}
          videoPoster={
            settings?.heroVideoPoster
              ? urlFor(settings.heroVideoPoster).width(1200).height(800).quality(80).format("webp").url()
              : undefined
          }
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
              title: "Since 1999",
              body: 'Decades of professional tattooing, rooted in a classic apprenticeship under Troy "Rabbit" Fox in Fort Worth and Duncanville, Texas.',
            },
            {
              title: "Internationally published, award winning art",
              body: "Recognition in competitive tattoo events and editorial features — with years of work across Texas, New Mexico, Missouri, and Kansas.",
            },
            {
              title: "Mansfield — appointment only",
              body: "Sean is based in Mansfield, Texas today. New projects are scheduled by appointment so every client gets proper time and attention.",
            },
          ].map((item) => (
            <article key={item.title} className="section-card rounded-xl p-5">
              <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </section>

        {/* Testimonial carousel */}
        {testimonials.length > 0 ? (
          <div className="pb-10">
            <TestimonialCarousel
              items={testimonials.slice(0, 5).map((t) => ({
                quote: t.quote,
                name: t.name,
                rating: t.rating,
              }))}
            />
          </div>
        ) : null}

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

        <InstagramStrip items={settings?.instagramFeed} />

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
                Tell Sean your idea. Consultations clarify the plan — deposits hold your spot once you are ready to book.
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

      <HomeStructuredData ratingValue={ratingValue} reviewCount={agg.count} />
    </>
  );
}

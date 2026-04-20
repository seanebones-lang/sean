import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/page-shell";
import { Link } from "@/i18n/navigation";
import { getTestimonials, getAggregateRating } from "@/lib/sanity/testimonials";
import { siteConfig } from "@/lib/site";
import { ReviewBridge } from "@/components/review-bridge";

type TestimonialsPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 120;

export async function generateMetadata({ params }: TestimonialsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Testimonials",
    description: "What clients say about their experience with Sean E Bones — quality, process, and long-term results.",
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/testimonials` },
    openGraph: {
      title: "Client Testimonials — Sean E Bones",
      description: "Genuine client feedback on tattoo quality, the booking process, and healing results.",
      url: `${siteConfig.siteUrl}/${locale}/testimonials`,
    },
  };
}

const fallbackTestimonials = [
  {
    _id: "f1",
    quote:
      "Incredible line quality and a calm, professional session from start to finish. Healing was straightforward with his aftercare notes.",
    name: "A. R.",
    rating: 5,
    clientLocation: null,
    reviewDate: null,
    verified: null,
    source: null,
    featured: true,
    artist: null,
    relatedPiece: null,
  },
  {
    _id: "f2",
    quote:
      "Sean translated my rough concept into a strong final design and made the whole process smooth.",
    name: "M. T.",
    rating: 5,
    clientLocation: null,
    reviewDate: null,
    verified: null,
    source: null,
    featured: false,
    artist: null,
    relatedPiece: null,
  },
  {
    _id: "f3",
    quote:
      "The detail, line quality, and healing notes were all top tier. Highly recommended.",
    name: "K. L.",
    rating: 5,
    clientLocation: null,
    reviewDate: null,
    verified: null,
    source: null,
    featured: false,
    artist: null,
    relatedPiece: null,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5 text-electric"
      aria-label={`Rating: ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden className={n <= rating ? "" : "opacity-30"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default async function TestimonialsPage({ params }: TestimonialsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [fetched, agg] = await Promise.all([getTestimonials(), getAggregateRating()]);
  const testimonials = fetched.length ? fetched : fallbackTestimonials;

  const ratingValue = agg.average ? Number(agg.average.toFixed(1)) : 5;
  const reviewCount = agg.count > 0 ? agg.count : testimonials.length;

  const aggLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${siteConfig.name} — Tattoo Services`,
    description: siteConfig.description,
    brand: { "@type": "Brand", name: siteConfig.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: testimonials.slice(0, 10).map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating ?? 5,
        bestRating: 5,
      },
      reviewBody: t.quote,
      ...(t.reviewDate ? { datePublished: t.reviewDate } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggLd) }}
      />
      <PageShell
        title="Testimonials"
        description="Client feedback focused on quality, process, and long-term satisfaction."
      >
        <div className="mb-6">
          <ReviewBridge heading="Share your experience" />
        </div>

        {/* Aggregate summary */}
        <div className="section-card mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl p-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="section-title text-3xl text-foreground">{ratingValue.toFixed(1)}</span>
              <StarRating rating={Math.round(ratingValue)} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </p>
          </div>
          <Link
            href="/contact"
            className="electric-ring inline-flex touch-manipulation items-center justify-center rounded-full border border-electric px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-foreground hover:text-electric"
          >
            Leave Feedback
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <article key={t._id} className="section-card flex flex-col gap-3 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <StarRating rating={t.rating ?? 5} />
                {t.verified ? (
                  <span className="rounded-full border border-electric/40 bg-electric/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-electric">
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="flex-1 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-1 flex items-baseline justify-between gap-2 border-t border-border pt-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-electric">{t.name}</p>
                  {t.clientLocation ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.clientLocation}</p>
                  ) : null}
                </div>
                {t.relatedPiece?.slug ? (
                  <Link
                    href={`/portfolio/${t.relatedPiece.slug}`}
                    className="text-xs text-muted-foreground hover:text-electric"
                  >
                    View piece →
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </PageShell>
    </>
  );
}

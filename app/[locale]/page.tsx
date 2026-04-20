import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/hero";
import { MobileBookCta } from "@/components/mobile-book-cta";
import { siteConfig } from "@/lib/site";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  const personLd = {
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
      </div>

      <MobileBookCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
    </>
  );
}

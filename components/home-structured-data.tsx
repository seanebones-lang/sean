import { siteConfig } from "@/lib/site";

type HomeStructuredDataProps = {
  ratingValue: number | null;
  reviewCount: number;
};

export function HomeStructuredData({ ratingValue, reviewCount }: HomeStructuredDataProps) {
  const address = {
    "@type": "PostalAddress",
    addressLocality: siteConfig.address.locality,
    addressRegion: siteConfig.address.region,
    addressCountry: siteConfig.address.country,
  };

  const geo = {
    "@type": "GeoCoordinates",
    latitude: siteConfig.address.lat,
    longitude: siteConfig.address.lng,
  };

  const openingHours = [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "12:00",
      closes: "20:00",
      validFrom: "2024-01-01",
      validThrough: "2099-12-31",
    },
  ];

  const sameAs = [
    siteConfig.instagram,
    siteConfig.facebook,
    siteConfig.reviews.google,
    siteConfig.reviews.yelp,
    siteConfig.reviews.facebook,
  ].filter(Boolean);

  const tattooParlorLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    "@id": `${siteConfig.siteUrl}#studio`,
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    email: siteConfig.email,
    description: siteConfig.description,
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card",
    address,
    geo,
    openingHoursSpecification: openingHours,
    areaServed: [
      { "@type": "AdministrativeArea", name: "Texas" },
      { "@type": "AdministrativeArea", name: "New Mexico" },
      { "@type": "AdministrativeArea", name: "Missouri" },
      { "@type": "AdministrativeArea", name: "Kansas" },
    ],
    sameAs,
  };

  if (ratingValue && reviewCount > 0) {
    tattooParlorLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.siteUrl}#sean`,
    name: siteConfig.name,
    jobTitle: "Tattoo Artist",
    email: siteConfig.email,
    url: siteConfig.siteUrl,
    sameAs,
    description: siteConfig.description,
    knowsAbout: [
      "Tattoo",
      "Custom tattoo",
      "Award-winning tattoo",
      "Internationally published tattoo art",
      "Fine line tattoo",
      "Black & grey tattoo",
      "Cover-up tattoo",
    ],
    worksFor: { "@id": `${siteConfig.siteUrl}#studio` },
    workLocation: { "@id": `${siteConfig.siteUrl}#studio` },
    hasOccupation: {
      "@type": "Occupation",
      name: "Tattoo Artist",
      startDate: "1999",
    },
  };

  const servicesLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Tattoo Services",
    provider: { "@id": `${siteConfig.siteUrl}#studio` },
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom Tattoo Design & Application",
          description:
            "Original custom tattoo designs tailored to your concept, placement, and style preferences.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Black & grey and color work",
          description:
            "Versatile tonal and color tattooing — from fine line and lettering to realism and custom illustrative pieces.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tattooParlorLd) }}
      />
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

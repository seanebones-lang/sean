import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import { getPortfolioPieceSlugs } from "@/app/[locale]/portfolio/[slug]/piece-data";
import { getArtistSlugs } from "@/app/[locale]/artists/[slug]/artist-data";
import { getBlogPostSlugs } from "@/lib/sanity/blog";
import { getStyleTags } from "@/lib/sanity/portfolio";

const staticRoutes = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/portfolio", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/portfolio/cover-ups", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/artists", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/booking", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/aftercare", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/journal", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/gift-cards", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/policies", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/testimonials", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const results = await Promise.allSettled([
    getPortfolioPieceSlugs(),
    getArtistSlugs(),
    getBlogPostSlugs(),
    getStyleTags(),
  ]);
  const [pieceSlugs, artistSlugs, blogSlugs, styleTags] = results.map((r) =>
    r.status === "fulfilled" ? r.value : []
  ) as [
    Awaited<ReturnType<typeof getPortfolioPieceSlugs>>,
    Awaited<ReturnType<typeof getArtistSlugs>>,
    Awaited<ReturnType<typeof getBlogPostSlugs>>,
    Awaited<ReturnType<typeof getStyleTags>>,
  ];

  const staticEntries = routing.locales.flatMap((locale) =>
    staticRoutes.map((r) => ({
      url: `${siteConfig.siteUrl}/${locale}${r.path}`,
      lastModified: new Date(),
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    }))
  );

  const portfolioEntries = routing.locales.flatMap((locale) =>
    pieceSlugs.map((p) => ({
      url: `${siteConfig.siteUrl}/${locale}/portfolio/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }))
  );

  const artistEntries = routing.locales.flatMap((locale) =>
    artistSlugs.map((a) => ({
      url: `${siteConfig.siteUrl}/${locale}/artists/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }))
  );

  const blogEntries = routing.locales.flatMap((locale) =>
    blogSlugs.map((b) => ({
      url: `${siteConfig.siteUrl}/${locale}/journal/${b.slug}`,
      lastModified: new Date(b.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }))
  );

  const styleEntries = routing.locales.flatMap((locale) =>
    styleTags.map((tag) => ({
      url: `${siteConfig.siteUrl}/${locale}/portfolio/style/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [
    ...staticEntries,
    ...portfolioEntries,
    ...artistEntries,
    ...blogEntries,
    ...styleEntries,
  ];
}

import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/sanity/lib/client";
import {
  coverUpPortfolioQuery,
  portfolioByStyleQuery,
  styleTagListQuery,
} from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";

export type PortfolioCard = {
  _id: string;
  title: string;
  slug: string | null;
  description?: string | null;
  styleTags?: string[] | null;
  featured?: boolean | null;
  images?: SanityImageSource[] | null;
  image?: SanityImageSource | null;
  mainImage?: SanityImageSource | null;
  healedImage?: SanityImageSource | null;
};

export type StyleTag = {
  label: string;
  slug: string;
};

export function slugifyStyle(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getPortfolioByStyle(styleRaw: string): Promise<PortfolioCard[]> {
  if (!sanityEnv.isConfigured) return [];
  try {
    const result = await sanityClient.fetch<PortfolioCard[]>(
      portfolioByStyleQuery,
      { styleLower: styleRaw.toLowerCase() },
      { next: { revalidate: 300 } }
    );
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
}

export async function getCoverUpPortfolio(): Promise<PortfolioCard[]> {
  if (!sanityEnv.isConfigured) return [];
  try {
    const result = await sanityClient.fetch<PortfolioCard[]>(
      coverUpPortfolioQuery,
      {},
      { next: { revalidate: 300 } }
    );
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
}

export async function getStyleTags(): Promise<StyleTag[]> {
  if (!sanityEnv.isConfigured) return [];
  try {
    const result = await sanityClient.fetch<string[]>(
      styleTagListQuery,
      {},
      { next: { revalidate: 300 } }
    );
    const unique = new Map<string, StyleTag>();
    for (const raw of result ?? []) {
      if (!raw) continue;
      const slug = slugifyStyle(raw);
      if (!slug) continue;
      if (!unique.has(slug)) unique.set(slug, { label: raw, slug });
    }
    return Array.from(unique.values()).sort((a, b) => a.label.localeCompare(b.label));
  } catch {
    return [];
  }
}

export async function resolveStyleTag(slug: string): Promise<StyleTag | null> {
  const all = await getStyleTags();
  return all.find((t) => t.slug === slug) ?? null;
}

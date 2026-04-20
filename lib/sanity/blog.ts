import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/sanity/lib/client";
import {
  blogPostBySlugQuery,
  blogPostListQuery,
  blogPostSlugsQuery,
} from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";

export type BlogPostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: SanityImageSource | null;
  publishedAt?: string | null;
  styleTags?: string[] | null;
  relatedPiece?: { title: string; slug: string | null } | null;
};

export type BlogPostDetail = BlogPostSummary & {
  body?: PortableTextBlock[] | null;
  relatedPiece?: {
    title: string;
    slug: string | null;
    images?: SanityImageSource[] | null;
  } | null;
};

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  if (!sanityEnv.isConfigured) return [];
  try {
    const result = await sanityClient.fetch<BlogPostSummary[]>(
      blogPostListQuery,
      {},
      { next: { revalidate: 300 } }
    );
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  if (!sanityEnv.isConfigured) return null;
  try {
    return await sanityClient.fetch<BlogPostDetail | null>(
      blogPostBySlugQuery,
      { slug },
      { next: { revalidate: 300 } }
    );
  } catch {
    return null;
  }
}

export async function getBlogPostSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  if (!sanityEnv.isConfigured) return [];
  try {
    const result = await sanityClient.fetch<{ slug: string; _updatedAt: string }[]>(
      blogPostSlugsQuery,
      {},
      { next: { revalidate: 300 } }
    );
    return result.map((r) => ({ slug: r.slug, updatedAt: r._updatedAt }));
  } catch {
    return [];
  }
}

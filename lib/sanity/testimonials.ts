import { sanityClient } from "@/sanity/lib/client";
import { aggregateRatingQuery, testimonialListQuery } from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";

export type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  rating?: number | null;
  clientLocation?: string | null;
  reviewDate?: string | null;
  verified?: boolean | null;
  source?: string | null;
  featured?: boolean | null;
  artist?: { name: string; slug: string | null } | null;
  relatedPiece?: { title: string; slug: string | null } | null;
};

export type AggregateRating = {
  count: number;
  average: number | null;
};

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!sanityEnv.isConfigured) return [];
  try {
    const result = await sanityClient.fetch<Testimonial[]>(
      testimonialListQuery,
      {},
      { next: { revalidate: 120 } }
    );
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
}

export async function getAggregateRating(): Promise<AggregateRating> {
  if (!sanityEnv.isConfigured) return { count: 0, average: null };
  try {
    const result = await sanityClient.fetch<AggregateRating>(
      aggregateRatingQuery,
      {},
      { next: { revalidate: 120 } }
    );
    return {
      count: result.count ?? 0,
      average: result.average ?? null,
    };
  } catch {
    return { count: 0, average: null };
  }
}

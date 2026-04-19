import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/sanity/lib/client";
import { artistBySlugQuery, artistSlugsQuery } from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";

export type ArtistPricingInfo = {
  hourlyRate?: number | null;
  minimumCharge?: number | null;
  depositAmount?: number | null;
  priceRange?: string | null;
};

export type ArtistStudioInfo = {
  studioName?: string | null;
  city?: string | null;
  stateRegion?: string | null;
  country?: string | null;
  address?: string | null;
  googleMapsUrl?: string | null;
  phone?: string | null;
};

export type ArtistSocials = {
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  email?: string | null;
  bookingUrl?: string | null;
};

export type ArtistPortfolioPiece = {
  _id: string;
  title: string;
  slug: string | null;
  images?: SanityImageSource[] | null;
  styleTags?: string[] | null;
  featured?: boolean | null;
};

export type ArtistDetail = {
  _id: string;
  name: string;
  slug: string;
  profileImage?: SanityImageSource | null;
  coverImage?: SanityImageSource | null;
  bio?: string | null;
  yearsExperience?: number | null;
  specialties?: string[] | null;
  availabilityStatus?: "open" | "waitlist" | "closed" | null;
  pricing?: ArtistPricingInfo | null;
  studioInfo?: ArtistStudioInfo | null;
  socials?: ArtistSocials | null;
  isSponsored?: boolean | null;
  certifications?: string[] | null;
  languages?: string[] | null;
  consultationRequired?: boolean | null;
  acceptedPayments?: string[] | null;
  featuredPieces?: ArtistPortfolioPiece[] | null;
  portfolioPieces?: ArtistPortfolioPiece[] | null;
};

export type ArtistFetchResult =
  | { ok: true; artist: ArtistDetail }
  | { ok: false; artist: null; error: string };

export async function getArtistBySlug(slug: string): Promise<ArtistFetchResult> {
  if (!sanityEnv.isConfigured) {
    return { ok: false, artist: null, error: "Sanity is not configured." };
  }
  try {
    const result = await sanityClient.fetch<ArtistDetail | null>(
      artistBySlugQuery,
      { slug },
      { next: { revalidate: 60 } }
    );
    if (!result) return { ok: false, artist: null, error: "Artist not found." };
    return { ok: true, artist: result };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, artist: null, error: message };
  }
}

export async function getArtistSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  if (!sanityEnv.isConfigured) return [];
  try {
    const result = await sanityClient.fetch<{ slug: string; _updatedAt: string }[]>(
      artistSlugsQuery,
      {},
      { next: { revalidate: 300 } }
    );
    return result.map((r) => ({ slug: r.slug, updatedAt: r._updatedAt }));
  } catch {
    return [];
  }
}

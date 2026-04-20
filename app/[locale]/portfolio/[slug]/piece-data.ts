import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/sanity/lib/client";
import { portfolioPieceBySlugQuery, portfolioSlugsQuery, relatedPiecesQuery } from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";

export type PieceArtist = {
  name: string;
  slug: string | null;
  profileImage?: SanityImageSource | null;
  specialties?: string[] | null;
  availabilityStatus?: string | null;
};

export type PortfolioPieceDetail = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  styleTags?: string[] | null;
  placement?: string | null;
  featured?: boolean | null;
  images?: SanityImageSource[] | null;
  healedImage?: SanityImageSource | null;
  publishedAt?: string | null;
  artist?: PieceArtist | null;
};

export type RelatedPiece = {
  _id: string;
  title: string;
  slug: string | null;
  styleTags?: string[] | null;
  images?: SanityImageSource[] | null;
};

export type PieceFetchResult =
  | { ok: true; piece: PortfolioPieceDetail; related: RelatedPiece[] }
  | { ok: false; piece: null; related: []; error: string };

export async function getPortfolioPieceBySlug(slug: string): Promise<PieceFetchResult> {
  if (!sanityEnv.isConfigured) {
    return { ok: false, piece: null, related: [], error: "Sanity is not configured." };
  }
  try {
    const piece = await sanityClient.fetch<PortfolioPieceDetail | null>(
      portfolioPieceBySlugQuery,
      { slug },
      { next: { revalidate: 60 } }
    );
    if (!piece) return { ok: false, piece: null, related: [], error: "Piece not found." };

    const related = await sanityClient.fetch<RelatedPiece[]>(
      relatedPiecesQuery,
      { slug, tags: piece.styleTags ?? [] },
      { next: { revalidate: 60 } }
    );

    return { ok: true, piece, related: Array.isArray(related) ? related : [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, piece: null, related: [], error: message };
  }
}

export async function getPortfolioPieceSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  if (!sanityEnv.isConfigured) return [];
  try {
    const result = await sanityClient.fetch<{ slug: string; _updatedAt: string }[]>(
      portfolioSlugsQuery,
      {},
      { next: { revalidate: 300 } }
    );
    return result.map((r) => ({ slug: r.slug, updatedAt: r._updatedAt }));
  } catch {
    return [];
  }
}

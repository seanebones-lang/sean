import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/sanity/lib/client";
import { portfolioListQuery } from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";

export type PortfolioListItem = {
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

export type PortfolioFetchResult =
  | { ok: true; pieces: PortfolioListItem[] }
  | { ok: false; pieces: []; error: string };

export async function getPortfolioPieces(): Promise<PortfolioFetchResult> {
  if (!sanityEnv.isConfigured) {
    return {
      ok: false,
      pieces: [],
      error: "Sanity env is not configured (missing project id or dataset).",
    };
  }

  try {
    const result = await sanityClient.fetch<PortfolioListItem[]>(
      portfolioListQuery,
      {},
      { next: { revalidate: 60 } }
    );
    return { ok: true, pieces: Array.isArray(result) ? result : [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[getPortfolioPieces] Sanity fetch failed:", err);
    return { ok: false, pieces: [], error: message };
  }
}

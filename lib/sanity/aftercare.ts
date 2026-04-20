import { sanityClient } from "@/sanity/lib/client";
import { aftercarePageQuery } from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";

export type AftercareStep = { heading: string; body?: string | null };

export type AftercarePage = {
  title?: string | null;
  intro?: string | null;
  steps?: AftercareStep[] | null;
  warningNote?: string | null;
  productRecommendations?: string | null;
};

export async function getAftercarePage(): Promise<AftercarePage | null> {
  if (!sanityEnv.isConfigured) return null;
  try {
    return await sanityClient.fetch<AftercarePage | null>(
      aftercarePageQuery,
      {},
      { next: { revalidate: 300 } }
    );
  } catch {
    return null;
  }
}

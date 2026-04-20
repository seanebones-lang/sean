import { sanityClient } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";

export type SiteSettings = {
  siteName?: string | null;
  tagline?: string | null;
  footerBio?: string | null;
  bookingUrl?: string | null;
  depositPaymentUrl?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  contactEmail?: string | null;
  phoneNumber?: string | null;
  studioAddress?: string | null;
  businessHours?: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!sanityEnv.isConfigured) return null;
  try {
    return await sanityClient.fetch<SiteSettings | null>(
      siteSettingsQuery,
      {},
      { next: { revalidate: 300 } }
    );
  } catch {
    return null;
  }
}

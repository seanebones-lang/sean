import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";

export type InstagramFeedItem = {
  image?: SanityImageSource | null;
  url?: string | null;
  caption?: string | null;
};

export type SiteSettings = {
  siteName?: string | null;
  tagline?: string | null;
  footerBio?: string | null;
  bookingUrl?: string | null;
  depositPaymentUrl?: string | null;
  bookingStatus?: "open" | "waitlist" | "closed" | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  contactEmail?: string | null;
  phoneNumber?: string | null;
  studioAddress?: string | null;
  businessHours?: string | null;
  instagramFeed?: InstagramFeedItem[] | null;
  heroVideoUrl?: string | null;
  heroVideoPoster?: SanityImageSource | null;
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

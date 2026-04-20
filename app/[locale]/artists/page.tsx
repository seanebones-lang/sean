import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { Link } from "@/i18n/navigation";
import { sanityClient } from "@/sanity/lib/client";
import { artistListQuery } from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";
import { urlFor } from "@/sanity/lib/image";
import { siteConfig } from "@/lib/site";
import type { SanityImageSource } from "@sanity/image-url";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Artists",
    description:
      "Artist profiles for Tattoos by Sean E Bones. Browse bios, specialties, portfolios, and booking availability.",
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/artists` },
    openGraph: {
      title: "Tattoo Artists — Sean E Bones Studio",
      description: "Browse artists, their styles, specialties, and current booking availability.",
      url: `${siteConfig.siteUrl}/${locale}/artists`,
    },
  };
}

type ArtistListItem = {
  _id: string;
  name: string;
  slug: string | null;
  profileImage?: SanityImageSource | null;
  specialties?: string[] | null;
  availabilityStatus?: "open" | "waitlist" | "closed" | null;
  isSponsored?: boolean | null;
  pieceCount?: number | null;
};

export const revalidate = 120;

async function getArtists(): Promise<ArtistListItem[]> {
  if (!sanityEnv.isConfigured) return [];
  try {
    const res = await sanityClient.fetch<ArtistListItem[]>(
      artistListQuery,
      {},
      { next: { revalidate: 120 } }
    );
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

const availBadge: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10" },
  waitlist: { label: "Waitlist", color: "text-amber-400 border-amber-400/40 bg-amber-400/10" },
  closed: { label: "Closed", color: "text-red-400 border-red-400/40 bg-red-400/10" },
};

export default async function ArtistsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const artists = await getArtists();

  return (
    <PageShell
      title="Artists"
      description={
        artists.length
          ? `${artists.length} artist${artists.length === 1 ? "" : "s"}. Tap a profile to view bio, portfolio, pricing, and booking availability.`
          : "Artist profiles will appear here once added in Sanity Studio."
      }
    >
      {artists.length === 0 ? (
        <div className="section-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground">No artists published yet.</p>
          <p className="mt-2 text-xs text-muted-foreground">
            In Sanity Studio, create an Artist document and publish it to see it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((a) => {
            const badge = a.availabilityStatus ? availBadge[a.availabilityStatus] : null;
            return (
              <Link
                key={a._id}
                href={`/artists/${a.slug}`}
                className="section-card group flex flex-col gap-4 rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(33,199,255,0.12)]"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-surface">
                    {a.profileImage ? (
                      <Image
                        src={urlFor(a.profileImage).width(128).height(128).quality(85).format("webp").url()}
                        alt={`${a.name} profile`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl text-muted-foreground">
                        {a.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-semibold text-foreground group-hover:text-electric">
                        {a.name}
                      </h2>
                      {a.isSponsored ? (
                        <span className="rounded-full border border-electric/40 bg-electric/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-electric">
                          Sponsor
                        </span>
                      ) : null}
                    </div>
                    {badge ? (
                      <span
                        className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge.color}`}
                      >
                        <span className="h-1 w-1 rounded-full bg-current" />
                        {badge.label}
                      </span>
                    ) : null}
                  </div>
                </div>

                {a.specialties?.length ? (
                  <p className="text-xs text-muted-foreground">
                    {a.specialties.slice(0, 3).join(" · ")}
                  </p>
                ) : null}

                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>
                    {a.pieceCount ?? 0} piece{a.pieceCount === 1 ? "" : "s"}
                  </span>
                  <span className="text-electric group-hover:underline">View profile →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}

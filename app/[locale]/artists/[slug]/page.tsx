import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import { siteConfig } from "@/lib/site";
import { PortfolioPieceCard } from "@/components/portfolio-piece-card";
import { BookingCta } from "@/components/booking-cta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MobileBookCta } from "@/components/mobile-book-cta";
import { WaitlistForm } from "@/components/waitlist-form";
import { getArtistBySlug, getArtistSlugs } from "./artist-data";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getArtistSlugs();
  return slugs.flatMap(({ slug }) => [
    { locale: "en", slug },
    { locale: "es", slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const result = await getArtistBySlug(slug);
  if (!result.ok) return {};

  const { artist } = result;
  const title = `${artist.name} | Tattoo Artist`;
  const description =
    artist.bio?.slice(0, 160) ??
    `Tattoo work by ${artist.name}. ${artist.specialties?.join(", ") ?? ""}`.trim();

  const imageUrl = artist.profileImage
    ? urlFor(artist.profileImage).width(1200).height(630).format("webp").url()
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630 }] } : {}),
    },
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/artists/${slug}`,
      languages: {
        en: `${siteConfig.siteUrl}/en/artists/${slug}`,
        es: `${siteConfig.siteUrl}/es/artists/${slug}`,
      },
    },
  };
}

const availabilityLabel: Record<string, { label: string; color: string }> = {
  open: { label: "Booking Open", color: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10" },
  waitlist: { label: "Waitlist Only", color: "text-amber-400 border-amber-400/40 bg-amber-400/10" },
  closed: { label: "Not Accepting Clients", color: "text-red-400 border-red-400/40 bg-red-400/10" },
};

export default async function ArtistPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const result = await getArtistBySlug(slug);
  if (!result.ok) notFound();

  const { artist } = result;
  const avail = artist.availabilityStatus
    ? (availabilityLabel[artist.availabilityStatus] ?? availabilityLabel.open)
    : availabilityLabel.open;

  const coverSrc = artist.coverImage
    ? urlFor(artist.coverImage).width(1400).height(500).format("webp").quality(85).url()
    : null;

  const profileSrc = artist.profileImage
    ? urlFor(artist.profileImage).width(400).height(400).format("webp").quality(90).url()
    : null;

  const bookingHref = artist.socials?.bookingUrl ?? "/booking";

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    description: artist.bio ?? undefined,
    ...(artist.socials?.email ? { email: artist.socials.email } : {}),
    ...(artist.socials?.instagram ? { sameAs: [artist.socials.instagram, artist.socials.facebook, artist.socials.tiktok].filter(Boolean) } : {}),
    knowsAbout: artist.specialties ?? ["Tattoo"],
    hasOccupation: {
      "@type": "Occupation",
      name: "Tattoo Artist",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />

      {/* Cover banner */}
      <div className="relative h-[min(40dvh,18rem)] w-full overflow-hidden bg-gradient-to-br from-surface to-black">
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt={`${artist.name} studio`}
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <MobileBookCta href={bookingHref} />

      <div className="mx-auto w-full max-w-6xl min-w-0 px-3 pb-16 min-[480px]:px-4 sm:px-6">
        <div className="pt-6">
          <Breadcrumbs
            locale={locale}
            items={[
              { label: "Home", href: "/" },
              { label: "Artists", href: "/artists" },
              { label: artist.name },
            ]}
          />
        </div>

        {/* Profile header */}
        <div className="relative -mt-16 mb-8 flex flex-col gap-4 sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-border bg-surface shadow-xl sm:h-36 sm:w-36">
            {profileSrc ? (
              <Image
                src={profileSrc}
                alt={`${artist.name} profile`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 112px, 144px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl text-muted-foreground">
                {artist.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="section-title text-[clamp(1.75rem,6vw,3rem)] leading-none text-foreground">
                {artist.name}
              </h1>
              {artist.isSponsored ? (
                <span className="rounded-full border border-electric/40 bg-electric/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-electric">
                  Sponsored
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${avail.color}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {avail.label}
              </span>
              {artist.yearsExperience ? (
                <span className="text-sm text-muted-foreground">
                  {artist.yearsExperience}+ years experience
                </span>
              ) : null}
              {artist.studioInfo?.city ? (
                <span className="text-sm text-muted-foreground">
                  {artist.studioInfo.city}
                  {artist.studioInfo.stateRegion ? `, ${artist.studioInfo.stateRegion}` : ""}
                </span>
              ) : null}
            </div>
          </div>

          <Link
            href={bookingHref}
            className="electric-ring shrink-0 inline-flex touch-manipulation items-center justify-center rounded-full border border-electric px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-foreground hover:text-electric sm:self-end"
          >
            Book Now
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          {/* Main column */}
          <div className="min-w-0 space-y-10">
            {/* Bio */}
            {artist.bio ? (
              <section>
                <h2 className="section-title mb-3 text-lg text-foreground">About</h2>
                <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                  {artist.bio}
                </p>
              </section>
            ) : null}

            {/* Specialties */}
            {artist.specialties?.length ? (
              <section>
                <h2 className="section-title mb-3 text-lg text-foreground">Specialties</h2>
                <ul className="flex flex-wrap gap-2">
                  {artist.specialties.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-electric/30 bg-electric/5 px-3 py-1 text-sm text-electric"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Portfolio */}
            {artist.portfolioPieces?.length ? (
              <section>
                <h2 className="section-title mb-4 text-lg text-foreground">
                  Portfolio ({artist.portfolioPieces.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {artist.portfolioPieces.map((piece, i) => (
                    <Link key={piece._id} href={`/portfolio/${piece.slug}`} className="group">
                      <PortfolioPieceCard
                        title={piece.title}
                        styleTags={piece.styleTags}
                        image={piece.images?.[0] ?? null}
                        featured={piece.featured ?? false}
                        priority={i < 3}
                      />
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Pricing */}
            {artist.pricing?.priceRange || artist.pricing?.hourlyRate ? (
              <div className="section-card rounded-xl p-5">
                <h3 className="section-title mb-3 text-sm text-foreground">Pricing</h3>
                {artist.pricing.priceRange ? (
                  <p className="text-foreground">{artist.pricing.priceRange}</p>
                ) : null}
                {artist.pricing.hourlyRate ? (
                  <p className="text-sm text-muted-foreground">
                    ${artist.pricing.hourlyRate}/hr
                  </p>
                ) : null}
                {artist.pricing.minimumCharge ? (
                  <p className="text-sm text-muted-foreground">
                    ${artist.pricing.minimumCharge} minimum
                  </p>
                ) : null}
                {artist.pricing.depositAmount ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    ${artist.pricing.depositAmount} deposit to hold appointment
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* Studio info */}
            {artist.studioInfo?.studioName || artist.studioInfo?.address ? (
              <div className="section-card rounded-xl p-5">
                <h3 className="section-title mb-3 text-sm text-foreground">Studio</h3>
                {artist.studioInfo.studioName ? (
                  <p className="font-medium text-foreground">{artist.studioInfo.studioName}</p>
                ) : null}
                {artist.studioInfo.address ? (
                  <p className="mt-1 text-sm text-muted-foreground">{artist.studioInfo.address}</p>
                ) : null}
                {artist.studioInfo.phone ? (
                  <a
                    href={`tel:${artist.studioInfo.phone}`}
                    className="mt-1 block text-sm text-muted-foreground hover:text-electric"
                  >
                    {artist.studioInfo.phone}
                  </a>
                ) : null}
                {artist.studioInfo.googleMapsUrl ? (
                  <a
                    href={artist.studioInfo.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-xs text-electric hover:underline"
                  >
                    View on Google Maps →
                  </a>
                ) : null}
              </div>
            ) : null}

            {/* Social links */}
            {(artist.socials?.instagram || artist.socials?.tiktok || artist.socials?.facebook || artist.socials?.email) ? (
              <div className="section-card rounded-xl p-5">
                <h3 className="section-title mb-3 text-sm text-foreground">Connect</h3>
                <div className="flex flex-col gap-2">
                  {artist.socials.instagram ? (
                    <a
                      href={artist.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground hover:text-electric"
                    >
                      Instagram →
                    </a>
                  ) : null}
                  {artist.socials.tiktok ? (
                    <a
                      href={artist.socials.tiktok}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground hover:text-electric"
                    >
                      TikTok →
                    </a>
                  ) : null}
                  {artist.socials.facebook ? (
                    <a
                      href={artist.socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground hover:text-electric"
                    >
                      Facebook →
                    </a>
                  ) : null}
                  {artist.socials.email ? (
                    <a
                      href={`mailto:${artist.socials.email}`}
                      className="text-sm text-muted-foreground hover:text-electric"
                    >
                      {artist.socials.email}
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* Languages */}
            {artist.languages?.length ? (
              <div className="section-card rounded-xl p-5">
                <h3 className="section-title mb-2 text-sm text-foreground">Languages</h3>
                <p className="text-sm text-muted-foreground">{artist.languages.join(", ")}</p>
              </div>
            ) : null}

            {/* Certifications */}
            {artist.certifications?.length ? (
              <div className="section-card rounded-xl p-5">
                <h3 className="section-title mb-2 text-sm text-foreground">Certifications</h3>
                <ul className="space-y-1">
                  {artist.certifications.map((c) => (
                    <li key={c} className="text-sm text-muted-foreground">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Book CTA or Waitlist */}
            {artist.availabilityStatus === "open" ? (
              <BookingCta href={bookingHref} />
            ) : (
              <WaitlistForm artistSlug={artist.slug} artistName={artist.name} />
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

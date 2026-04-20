import Image from "next/image";
import type { InstagramFeedItem } from "@/lib/sanity/site-settings";
import { urlFor } from "@/sanity/lib/image";
import { siteConfig } from "@/lib/site";
import { InstagramTileLink } from "./instagram-tile-link";

type InstagramStripProps = {
  items?: InstagramFeedItem[] | null;
  profileUrl?: string;
  heading?: string;
  subheading?: string;
};

export function InstagramStrip({
  items,
  profileUrl,
  heading = "From the studio",
  subheading = "Fresh work, open-slot drops, and flash sheets on Instagram.",
}: InstagramStripProps) {
  const resolvedProfile = profileUrl || siteConfig.instagram;
  const posts = (items ?? []).filter((i) => i?.image && i?.url).slice(0, 6);

  if (posts.length === 0) {
    if (!resolvedProfile) return null;
    return (
      <section className="pb-10">
        <div className="section-card rounded-xl p-5 text-center">
          <h2 className="section-title text-sm text-electric">{heading}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>
          <a
            href={resolvedProfile}
            target="_blank"
            rel="noreferrer"
            className="electric-ring mt-4 inline-flex touch-manipulation items-center justify-center rounded-full border border-electric px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-foreground hover:text-electric"
          >
            Follow on Instagram
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title text-xl text-foreground sm:text-2xl">{heading}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{subheading}</p>
        </div>
        {resolvedProfile ? (
          <a
            href={resolvedProfile}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold uppercase tracking-widest text-electric hover:underline"
          >
            View all →
          </a>
        ) : null}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {posts.map((post, i) => (
          <InstagramTileLink
            key={`${post.url}-${i}`}
            href={post.url!}
            caption={post.caption ?? undefined}
          >
            <Image
              src={urlFor(post.image!).width(400).height(400).quality(80).format("webp").url()}
              alt={post.caption || "Instagram post"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 33vw, 16vw"
            />
          </InstagramTileLink>
        ))}
      </div>
    </section>
  );
}

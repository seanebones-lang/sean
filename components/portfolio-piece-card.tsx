import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";

export type PortfolioPieceCardProps = {
  title: string;
  description?: string | null;
  styleTags?: string[] | null;
  image?: SanityImageSource | null;
  featured?: boolean;
  priority?: boolean;
};

export function PortfolioPieceCard({ title, description, styleTags, image, featured, priority = false }: PortfolioPieceCardProps) {
  const alt = description?.trim() ? `${title} — ${description.trim().slice(0, 120)}` : title;

  return (
    <article className="section-card flex min-w-0 flex-col overflow-hidden rounded-xl transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(33,199,255,0.1)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-surface to-black">
        {featured ? (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-electric/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-black">
            Featured
          </span>
        ) : null}
        {image ? (
          <Image
            src={urlFor(image).width(900).height(1125).quality(85).format("webp").url()}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center border-b border-border text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="font-semibold leading-snug text-foreground">{title}</h2>
        {description ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>
        ) : null}
        {styleTags?.length ? (
          <ul className="mt-auto flex flex-wrap gap-1.5">
            {styleTags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

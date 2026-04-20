import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PortableText } from "@portabletext/react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BookingCta } from "@/components/booking-cta";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { urlFor } from "@/sanity/lib/image";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/sanity/blog";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.flatMap(({ slug }) => [
    { locale: "en", slug },
    { locale: "es", slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  const image = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).format("webp").url()
    : undefined;

  return {
    title: post.title,
    description: post.excerpt ?? `Journal post from Sean E Bones — ${post.title}.`,
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}/journal/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const cover = post.coverImage
    ? urlFor(post.coverImage).width(1600).height(900).quality(85).format("webp").url()
    : null;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt ?? undefined,
    author: { "@type": "Person", name: siteConfig.name },
    image: cover ?? undefined,
    description: post.excerpt ?? undefined,
    mainEntityOfPage: `${siteConfig.siteUrl}/${locale}/journal/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <div className="mx-auto w-full max-w-3xl px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
        <Breadcrumbs
          locale={locale}
          items={[
            { label: "Home", href: "/" },
            { label: "Journal", href: "/journal" },
            { label: post.title },
          ]}
        />

        <article className="mt-6">
          <h1 className="section-title text-[clamp(2rem,6vw,3rem)] leading-[1.05] text-foreground">
            {post.title}
          </h1>
          {post.publishedAt ? (
            <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          ) : null}

          {cover ? (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl border border-border">
              <Image
                src={cover}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48rem"
                className="object-cover"
              />
            </div>
          ) : null}

          {post.excerpt ? (
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          ) : null}

          {post.body?.length ? (
            <div className="prose prose-invert mt-6 max-w-none text-base leading-relaxed text-muted-foreground">
              <PortableText value={post.body} />
            </div>
          ) : null}

          {post.relatedPiece?.slug ? (
            <div className="mt-10 section-card rounded-xl p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Related piece</p>
              <Link
                href={`/portfolio/${post.relatedPiece.slug}`}
                className="mt-1 inline-flex items-center gap-2 font-semibold text-foreground hover:text-electric"
              >
                {post.relatedPiece.title}
                <span className="text-electric">→</span>
              </Link>
            </div>
          ) : null}

          <div className="mt-10">
            <BookingCta />
          </div>
        </article>
      </div>
    </>
  );
}

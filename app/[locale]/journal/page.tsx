import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/page-shell";
import { Link } from "@/i18n/navigation";
import { getBlogPosts } from "@/lib/sanity/blog";
import { siteConfig } from "@/lib/site";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Journal",
    description:
      "Notes on tattoo care, style guides, cover-up strategy, and studio updates from Sean E Bones.",
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/journal` },
    openGraph: {
      title: "Journal — Sean E Bones",
      description: "Essays on tattoo style, care, and craft from the studio.",
      url: `${siteConfig.siteUrl}/${locale}/journal`,
    },
  };
}

export default async function JournalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getBlogPosts();

  return (
    <PageShell
      title="Journal"
      description="Tattoo style, care, and craft notes from Sean's studio."
    >
      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          New posts are on the way — in the meantime, browse the{" "}
          <Link href="/portfolio" className="text-electric hover:underline">portfolio</Link>.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/journal/${post.slug}`}
              className="section-card group flex flex-col overflow-hidden rounded-xl transition hover:border-electric/40"
            >
              {post.coverImage ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={urlFor(post.coverImage).width(800).height(500).quality(80).format("webp").url()}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="section-title text-lg text-foreground">{post.title}</h2>
                {post.excerpt ? (
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                ) : null}
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground">
                  {post.publishedAt ? (
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  ) : null}
                  {post.styleTags?.length
                    ? post.styleTags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))
                    : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}

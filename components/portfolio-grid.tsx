"use client";

import { useMemo, useCallback, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PortfolioPieceCard } from "./portfolio-piece-card";
import { cn } from "@/lib/utils";
import type { PortfolioListItem } from "@/app/[locale]/portfolio/portfolio-data";

type PortfolioGridProps = {
  pieces: PortfolioListItem[];
};

export function PortfolioGrid({ pieces }: PortfolioGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("style") ?? "all";
  const [search, setSearch] = useState("");

  const setActiveTag = useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tag === "all") {
        params.delete("style");
      } else {
        params.set("style", tag);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    pieces.forEach((p) => p.styleTags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [pieces]);

  const filtered = useMemo(() => {
    let result = activeTag === "all" ? pieces : pieces.filter((p) => p.styleTags?.includes(activeTag));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.styleTags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [pieces, activeTag, search]);

  return (
    <div>
      {/* Search + Filter row */}
      <div className="mb-6 space-y-3">
        {pieces.length > 6 ? (
          <div className="relative max-w-sm">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pieces…"
              className="h-10 w-full rounded-full border border-border bg-black/30 px-4 pr-9 text-sm outline-none focus:border-electric placeholder:text-muted-foreground"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-electric"
                aria-label="Clear search"
              >
                ×
              </button>
            ) : null}
          </div>
        ) : null}

        {allTags.length > 0 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by style">
            <button
              type="button"
              aria-pressed={activeTag === "all"}
              onClick={() => setActiveTag("all")}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors",
                activeTag === "all"
                  ? "border-electric bg-electric/10 text-electric"
                  : "border-border text-muted-foreground hover:border-electric/60 hover:text-electric"
              )}
            >
              All ({pieces.length})
            </button>
            {allTags.map((tag) => {
              const count = pieces.filter((p) => p.styleTags?.includes(tag)).length;
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={activeTag === tag}
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors",
                    activeTag === tag
                      ? "border-electric bg-electric/10 text-electric"
                      : "border-border text-muted-foreground hover:border-electric/60 hover:text-electric"
                  )}
                >
                  {tag} ({count})
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Screen-reader live region for filter results */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {filtered.length === pieces.length
          ? `Showing all ${pieces.length} pieces`
          : `${filtered.length} piece${filtered.length === 1 ? "" : "s"} found`}
      </p>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((piece, i) => (
          <Link key={piece._id} href={`/portfolio/${piece.slug}`} className="group">
            <PortfolioPieceCard
              title={piece.title}
              description={piece.description}
              styleTags={piece.styleTags}
              image={
                piece.images?.find(Boolean) ??
                piece.image ??
                piece.mainImage ??
                piece.healedImage ??
                null
              }
              featured={piece.featured ?? false}
              priority={i < 3}
            />
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          {search ? `No pieces match "${search}".` : "No pieces match this style filter."}
        </p>
      ) : null}
    </div>
  );
}

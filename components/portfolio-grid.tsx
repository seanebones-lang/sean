"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { PortfolioPieceCard } from "./portfolio-piece-card";
import { cn } from "@/lib/utils";
import type { PortfolioListItem } from "@/app/[locale]/portfolio/portfolio-data";

type PortfolioGridProps = {
  pieces: PortfolioListItem[];
};

export function PortfolioGrid({ pieces }: PortfolioGridProps) {
  const [activeTag, setActiveTag] = useState<string>("all");

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    pieces.forEach((p) => p.styleTags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [pieces]);

  const filtered = useMemo(() => {
    if (activeTag === "all") return pieces;
    return pieces.filter((p) => p.styleTags?.includes(activeTag));
  }, [pieces, activeTag]);

  return (
    <div>
      {/* Filter chips */}
      {allTags.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by style">
          <button
            type="button"
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

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((piece) => (
          <Link key={piece._id} href={`/portfolio/${piece.slug}`} className="group">
            <PortfolioPieceCard
              title={piece.title}
              description={piece.description}
              styleTags={piece.styleTags}
              image={piece.images?.[0] ?? null}
              featured={piece.featured ?? false}
            />
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No pieces match this style filter.</p>
      ) : null}
    </div>
  );
}

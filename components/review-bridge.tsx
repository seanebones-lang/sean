"use client";

import { track } from "@vercel/analytics";
import { siteConfig } from "@/lib/site";

type ReviewBridgeProps = {
  heading?: string;
  compact?: boolean;
};

export function ReviewBridge({ heading, compact = false }: ReviewBridgeProps) {
  const sources: { name: string; url: string; key: string }[] = [
    { name: "Google", url: siteConfig.reviews.google, key: "google" },
    { name: "Yelp", url: siteConfig.reviews.yelp, key: "yelp" },
    { name: "Facebook", url: siteConfig.reviews.facebook, key: "facebook" },
  ].filter((s) => s.url);

  if (sources.length === 0) return null;

  return (
    <div className={compact ? "flex flex-wrap items-center gap-3 text-xs" : "section-card rounded-xl p-5"}>
      {!compact && heading ? (
        <h2 className="section-title mb-1 text-sm text-electric">{heading}</h2>
      ) : null}
      {!compact ? (
        <p className="mb-3 text-sm text-muted-foreground">
          Loved your session? Share a short review — it helps more people find Sean.
        </p>
      ) : (
        <span className="text-muted-foreground">Leave a review:</span>
      )}
      <div className="flex flex-wrap gap-2">
        {sources.map((s) => (
          <a
            key={s.key}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("review_bridge_clicked", { source: s.key })}
            className="inline-flex min-h-9 touch-manipulation items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:border-electric/40 hover:text-electric"
          >
            {s.name} →
          </a>
        ))}
      </div>
    </div>
  );
}

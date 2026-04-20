"use client";

import { track } from "@vercel/analytics";

type InstagramTileLinkProps = {
  href: string;
  caption?: string;
  children: React.ReactNode;
};

export function InstagramTileLink({ href, caption, children }: InstagramTileLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={caption || "Instagram post"}
      onClick={() => track("instagram_tile_clicked", { href })}
      className="group relative block aspect-square overflow-hidden rounded-lg border border-border bg-surface"
    >
      {children}
    </a>
  );
}

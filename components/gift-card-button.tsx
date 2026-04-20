"use client";

import { track } from "@vercel/analytics";

export function GiftCardButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => track("gift_card_clicked")}
      className="electric-ring inline-flex touch-manipulation items-center justify-center rounded-full border border-electric px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-foreground hover:text-electric"
    >
      {label}
    </a>
  );
}

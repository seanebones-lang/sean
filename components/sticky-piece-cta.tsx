"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { Link } from "@/i18n/navigation";

type StickyPieceCtaProps = {
  title: string;
  href: string;
};

export function StickyPieceCta({ title, href }: StickyPieceCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 transition-all duration-300 lg:block ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <Link
        href={href}
        onClick={() => track("sticky_piece_cta_clicked", { title })}
        className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-electric bg-background/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground shadow-lg backdrop-blur hover:text-electric"
      >
        <span className="truncate max-w-[14rem]">Book a session like &quot;{title}&quot;</span>
        <span className="text-electric">&rarr;</span>
      </Link>
    </div>
  );
}

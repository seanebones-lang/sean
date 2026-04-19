"use client";

import { Link } from "@/i18n/navigation";

type MobileBookCtaProps = {
  href?: string;
  label?: string;
};

export function MobileBookCta({ href = "/booking", label = "Book Consultation" }: MobileBookCtaProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden pb-[env(safe-area-inset-bottom)] pointer-events-none">
      <div className="pointer-events-auto mx-auto flex max-w-sm justify-center px-4 pb-4">
        <Link
          href={href}
          className="electric-ring flex w-full touch-manipulation items-center justify-center rounded-full border border-electric bg-black/90 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-foreground backdrop-blur-xl hover:text-electric shadow-[0_0_30px_rgba(33,199,255,0.15)]"
        >
          {label}
        </Link>
      </div>
    </div>
  );
}

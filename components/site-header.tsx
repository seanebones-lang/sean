"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "./locale-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-black/70 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 min-[480px]:gap-4 min-[480px]:px-4 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="section-title min-w-0 shrink text-lg text-foreground min-[400px]:text-xl sm:text-2xl"
        >
          <span className="block truncate">Cody Meneley</span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-electric"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 min-[400px]:gap-2 min-[480px]:gap-3">
          <LocaleSwitcher />
          <Link
            href="/booking"
            className="electric-ring inline-flex touch-manipulation items-center justify-center rounded-full border border-electric px-2.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground hover:text-electric min-[380px]:px-3 min-[380px]:tracking-[0.12em] sm:px-4 sm:text-xs sm:tracking-[0.15em]"
          >
            {common("bookNow")}
          </Link>

          <button
            type="button"
            className="inline-flex h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg border border-border bg-surface/80 text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">{common("openMenu")}</span>
            <span className="flex flex-col gap-1.5 px-0.5" aria-hidden>
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/70 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0"
          )}
          tabIndex={open ? 0 : -1}
          aria-label={common("closeMenu")}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full max-h-[100dvh] w-[min(100%,20rem)] flex-col border-l border-border bg-background/98 pt-[env(safe-area-inset-top)] shadow-xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="section-title text-lg text-foreground">Menu</span>
            <button
              type="button"
              className="flex h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg border border-border text-lg leading-none text-muted-foreground hover:text-electric"
              onClick={() => setOpen(false)}
            >
              <span aria-hidden>×</span>
              <span className="sr-only">{common("closeMenu")}</span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-2 py-4" aria-label="Mobile primary">
            <Link
              href="/booking"
              className="electric-ring flex min-h-12 touch-manipulation items-center justify-center rounded-xl border border-electric px-4 text-sm font-semibold uppercase tracking-[0.12em] text-foreground"
              onClick={() => setOpen(false)}
            >
              {common("bookNow")}
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="flex min-h-12 touch-manipulation items-center rounded-xl px-4 text-base text-foreground hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

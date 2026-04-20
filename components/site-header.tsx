"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "./locale-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Derive active segment: strip locale prefix from pathname
  const activeSegment = "/" + (pathname.split("/").slice(2).join("/") || "");
  const menuTitleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  useLayoutEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus({ preventScroll: true });
  }, [open]);

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
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-black/70 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 min-[480px]:gap-4 min-[480px]:px-4 sm:px-6 sm:py-4">
          <Link
            href="/"
            className="section-title min-w-0 shrink text-lg text-foreground min-[400px]:text-xl sm:text-2xl"
          >
            <span className="block truncate">Cody Meneley</span>
          </Link>

          <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = item.href === "/"
                ? activeSegment === "/"
                : activeSegment.startsWith(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-sm transition-colors",
                    isActive ? "text-electric" : "text-muted-foreground hover:text-electric"
                  )}
                >
                  {t(item.key)}
                </Link>
              );
            })}
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
              aria-label={open ? common("closeMenu") : common("openMenu")}
              onClick={toggle}
            >
              {open ? (
                <span className="text-xl leading-none" aria-hidden>
                  ×
                </span>
              ) : (
                <span className="flex flex-col gap-1.5 px-0.5" aria-hidden>
                  <span className="h-0.5 w-5 rounded-full bg-current" />
                  <span className="h-0.5 w-5 rounded-full bg-current" />
                  <span className="h-0.5 w-5 rounded-full bg-current" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Sibling of <header> so `position:fixed` is not trapped by header `backdrop-filter` */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-labelledby={menuTitleId}
        className={cn(
          "fixed inset-0 z-[200] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 z-0 bg-black/70 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0"
          )}
          tabIndex={open ? 0 : -1}
          aria-label={common("closeMenu")}
          onClick={close}
        />

        <div
          className={cn(
            "absolute right-0 top-0 z-10 flex h-full max-h-[100dvh] w-[min(100%,20rem)] flex-col border-l border-border bg-background shadow-xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
          inert={!open}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <span id={menuTitleId} className="section-title text-lg text-foreground">
              Menu
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              className="flex h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg border border-border text-xl leading-none text-muted-foreground hover:text-electric"
              onClick={close}
            >
              <span aria-hidden>×</span>
              <span className="sr-only">{common("closeMenu")}</span>
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-y-contain px-2 py-4 [-webkit-overflow-scrolling:touch]"
            aria-label="Mobile primary"
          >
            <Link
              href="/booking"
              className="electric-ring flex min-h-12 touch-manipulation items-center justify-center rounded-xl border border-electric px-4 text-sm font-semibold uppercase tracking-[0.12em] text-foreground"
              onClick={close}
            >
              {common("bookNow")}
            </Link>
            {navItems.map((item) => {
              const isActive = item.href === "/"
                ? activeSegment === "/"
                : activeSegment.startsWith(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 touch-manipulation items-center rounded-xl px-4 text-base active:bg-surface hover:bg-surface",
                    isActive ? "text-electric" : "text-foreground"
                  )}
                  onClick={close}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </>
  );
}

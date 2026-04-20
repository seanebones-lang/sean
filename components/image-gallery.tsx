"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BeforeAfterSlider } from "./before-after-slider";

type GalleryImage = {
  src: string;
  thumb: string;
  alt: string;
};

type ImageGalleryProps = {
  images: GalleryImage[];
  healedUrl?: string | null;
  title: string;
};

export function ImageGallery({ images, healedUrl, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const allImages = images;

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));
  }, [allImages.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === allImages.length - 1 ? 0 : i + 1));
  }, [allImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    const prev_ = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev_;
    };
  }, [lightboxOpen, prev, next]);

  // Touch swipe support for lightbox
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = (e.changedTouches[0]?.clientX ?? 0) - touchStart.current;
    if (Math.abs(diff) > 40) diff < 0 ? next() : prev();
    touchStart.current = null;
  };

  const active = allImages[activeIndex];

  if (!allImages.length) return null;

  return (
    <>
      {/* Main display */}
      <div className="space-y-3">
        {/* Hero image / compare slider */}
        {compareMode && healedUrl && active ? (
          <BeforeAfterSlider
            beforeSrc={active.src}
            afterSrc={healedUrl}
            alt={title}
          />
        ) : (
          <button
            type="button"
            className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl bg-gradient-to-br from-surface to-black"
            style={{ aspectRatio: "4/5" }}
            onClick={() => setLightboxOpen(true)}
            aria-label={`Enlarge image: ${active?.alt}`}
          >
            {active ? (
              <Image
                src={active.src}
                alt={active.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            ) : null}
            <span className="absolute right-3 bottom-3 rounded-lg bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              Tap to enlarge
            </span>
          </button>
        )}

        {/* Before/after compare toggle */}
        {healedUrl ? (
          <button
            type="button"
            onClick={() => setCompareMode((v) => !v)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors",
              compareMode
                ? "border-electric bg-electric/10 text-electric"
                : "border-border text-muted-foreground hover:border-electric/60 hover:text-electric"
            )}
          >
            {compareMode ? "Hide comparison" : "Compare healed"}
          </button>
        ) : null}

        {/* Thumbnail strip */}
        {allImages.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Gallery thumbnails">
            {allImages.map((img, i) => (
              <button
                key={img.src}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`View image ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                  i === activeIndex ? "border-electric" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={img.thumb}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Lightbox */}
      {lightboxOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxOpen(false);
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close image viewer"
          >
            <span aria-hidden className="text-xl leading-none">×</span>
          </button>

          {allImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Previous image"
              >
                <span aria-hidden>‹</span>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-14 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Next image"
              >
                <span aria-hidden>›</span>
              </button>
            </>
          ) : null}

          {active ? (
            <div className="relative max-h-[90dvh] max-w-[90vw]" style={{ aspectRatio: "4/5" }}>
              <Image
                src={active.src}
                alt={active.alt}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
          ) : null}

          {allImages.length > 1 ? (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60">
              {activeIndex + 1} / {allImages.length}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

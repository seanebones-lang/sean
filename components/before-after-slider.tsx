"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Fresh",
  afterLabel = "Healed",
  alt,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    updatePosition(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    updatePosition(e.touches[0]!.clientX);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) updatePosition(e.clientX); };
    const onUp = () => { dragging.current = false; };
    const onTouchMove = (e: TouchEvent) => { if (dragging.current) updatePosition(e.touches[0]!.clientX); };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none overflow-hidden rounded-xl bg-gradient-to-br from-surface to-black"
      style={{ aspectRatio: "4/5", cursor: "col-resize" }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      role="img"
      aria-label={`Before and after comparison: ${alt}`}
    >
      {/* After (healed) — full width base */}
      <Image
        src={afterSrc}
        alt={`${alt} — ${afterLabel}`}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 60vw"
        priority
      />

      {/* Before (fresh) — clipped to left side */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div className="relative h-full w-full" style={{ minWidth: "100vw" }}>
          <Image
            src={beforeSrc}
            alt={`${alt} — ${beforeLabel}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>
      </div>

      {/* Divider line */}
      <div
        className="absolute inset-y-0 z-10 flex items-center justify-center"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        aria-hidden
      >
        <div className="h-full w-px bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        <div className="absolute flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 shadow-lg backdrop-blur-sm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M5 8l-3 3-3-3M5 8L2 5M11 8l3 3 3-3M11 8l3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="2" y1="8" x2="14" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
        {afterLabel}
      </span>
    </div>
  );
}

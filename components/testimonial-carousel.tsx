"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Quote = { quote: string; name: string; rating?: number | null };

export function TestimonialCarousel({ items }: { items: Quote[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1 || paused) return;
    intervalRef.current = setInterval(advance, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [items.length, paused, advance]);

  const goTo = (i: number) => {
    setIndex(i);
    // reset timer on manual nav
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!paused && items.length > 1) {
      intervalRef.current = setInterval(advance, 5000);
    }
  };

  const item = items[index];
  if (!item) return null;

  return (
    <div
      className="section-card rounded-xl px-6 py-8 text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {item.rating ? (
        <div className="mb-3 flex justify-center text-electric" aria-label={`${item.rating} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} aria-hidden className={n <= item.rating! ? "" : "opacity-30"}>★</span>
          ))}
        </div>
      ) : null}
      <blockquote className="text-lg italic leading-relaxed text-foreground">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <cite className="mt-4 block text-xs uppercase tracking-widest text-electric not-italic">
        {item.name}
      </cite>
      {items.length > 1 ? (
        <div className="mt-4 flex justify-center gap-1.5" role="tablist" aria-label="Testimonial navigation">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show quote ${i + 1} of ${items.length}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-electric" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

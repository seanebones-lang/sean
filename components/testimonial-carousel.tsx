"use client";

import { useState, useEffect } from "react";

type Quote = { quote: string; name: string; rating?: number | null };

export function TestimonialCarousel({ items }: { items: Quote[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const item = items[index];
  if (!item) return null;

  return (
    <div className="section-card rounded-xl px-6 py-8 text-center">
      {item.rating ? (
        <div className="mb-3 flex justify-center text-electric" aria-label={`${item.rating} stars`}>
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
        <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-electric" : "w-1.5 bg-border"}`}
              aria-label={`Go to quote ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

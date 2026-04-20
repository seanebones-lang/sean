"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="grid gap-2">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const triggerId = `${baseId}-trigger-${i}`;
        return (
          <div key={item.question} className="section-card overflow-hidden rounded-xl">
            <button
              id={triggerId}
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-semibold text-foreground">{item.question}</span>
              <span
                className={cn(
                  "shrink-0 text-electric transition-transform duration-200",
                  isOpen ? "rotate-45" : "rotate-0"
                )}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
            >
              {isOpen ? (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

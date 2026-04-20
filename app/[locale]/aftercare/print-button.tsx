"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:border-electric/40 hover:text-electric"
    >
      Print guide
    </button>
  );
}

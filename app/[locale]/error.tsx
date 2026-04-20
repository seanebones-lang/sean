"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[LocaleError]", error);
    }
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
      <h1 className="section-title text-3xl text-foreground">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">
        This page hit an unexpected error. It's been logged — you can try again or head home.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-muted-foreground">Reference: {error.digest}</p>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="electric-ring min-h-11 rounded-full border border-electric px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground hover:text-electric"
        >
          Try again
        </button>
        <Link
          href="/"
          className="min-h-11 rounded-full border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:border-electric/40 hover:text-electric"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

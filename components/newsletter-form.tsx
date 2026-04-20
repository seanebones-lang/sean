"use client";

import { useActionState, useEffect } from "react";
import { track } from "@vercel/analytics";
import { joinNewsletter } from "@/app/actions/newsletter";

const initialState = { success: false, message: "" };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(joinNewsletter, initialState);

  useEffect(() => {
    if (state.success) track("newsletter_signup");
  }, [state.success]);

  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-2">
      <label className="text-xs uppercase tracking-widest text-electric" htmlFor="newsletter-email">
        Newsletter
      </label>
      <p className="text-xs text-muted-foreground">
        Occasional flash drops, open dates, and studio notes. No spam.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="min-h-10 flex-1 rounded-full border border-border bg-black/30 px-3 py-2 text-sm text-foreground outline-none focus:border-electric"
        />
        <div className="hidden" aria-hidden>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="electric-ring min-h-10 rounded-full border border-electric px-4 py-2 text-xs font-semibold uppercase tracking-widest text-foreground hover:text-electric disabled:opacity-70"
        >
          {pending ? "Sending…" : "Subscribe"}
        </button>
      </div>
      {state.message ? (
        <p
          role="status"
          className={state.success ? "text-xs text-electric" : "text-xs text-red-400"}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

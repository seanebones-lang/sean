"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions/contact";

const initialState = {
  success: false,
  message: "",
};

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);

  return (
    <form action={action} className="section-card grid gap-4 rounded-xl p-4 min-[480px]:p-6">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm text-muted-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="min-h-11 rounded-lg border border-border bg-black/30 px-3 py-2 text-base outline-none focus:border-electric"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm text-muted-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="min-h-11 rounded-lg border border-border bg-black/30 px-3 py-2 text-base outline-none focus:border-electric"
        />
      </div>

      <div className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" autoComplete="off" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="idea" className="text-sm text-muted-foreground">
          Tattoo idea details
        </label>
        <textarea
          id="idea"
          name="idea"
          required
          minLength={20}
          rows={6}
          className="min-h-[10rem] rounded-lg border border-border bg-black/30 px-3 py-2 text-base outline-none focus:border-electric"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="electric-ring min-h-12 touch-manipulation rounded-full border border-electric px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] disabled:opacity-70"
      >
        {pending ? "Sending..." : "Send Request"}
      </button>

      {state.message ? (
        <p className={state.success ? "text-sm text-electric" : "text-sm text-red-400"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

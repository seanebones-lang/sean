"use client";

import { useActionState, useState } from "react";
import { joinWaitlist } from "@/app/actions/waitlist";

const initialState = { success: false, message: "" };

type WaitlistFormProps = {
  artistSlug?: string;
  artistName?: string;
};

export function WaitlistForm({ artistSlug, artistName }: WaitlistFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [state, action, pending] = useActionState(joinWaitlist, initialState);

  return (
    <div className="section-card rounded-xl p-5">
      <h3 className="section-title mb-1 text-sm text-foreground">Waitlist</h3>
      <p className="text-sm text-muted-foreground">
        {artistName
          ? `${artistName} isn't taking new bookings right now — join the waitlist and we'll reach out when spots open.`
          : "Join the waitlist and we'll reach out when bookings open."}
      </p>

      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="electric-ring mt-4 inline-flex touch-manipulation items-center justify-center rounded-full border border-electric px-4 py-2 text-xs font-semibold uppercase tracking-widest text-foreground hover:text-electric"
        >
          Join Waitlist
        </button>
      ) : (
        <form action={action} className="mt-4 flex flex-col gap-3">
          {artistSlug ? <input type="hidden" name="artistSlug" value={artistSlug} /> : null}
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            className="min-h-10 rounded-lg border border-border bg-black/30 px-3 py-2 text-sm outline-none focus:border-electric"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="min-h-10 rounded-lg border border-border bg-black/30 px-3 py-2 text-sm outline-none focus:border-electric"
          />
          <textarea
            name="note"
            rows={2}
            placeholder="Brief idea (optional)"
            className="min-h-[4rem] rounded-lg border border-border bg-black/30 px-3 py-2 text-sm outline-none focus:border-electric"
          />
          <div className="hidden" aria-hidden>
            <input name="website" type="text" tabIndex={-1} />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="electric-ring min-h-10 rounded-full border border-electric px-4 py-2 text-xs font-semibold uppercase tracking-widest disabled:opacity-70"
          >
            {pending ? "Adding..." : "Add me"}
          </button>
          {state.message ? (
            <p
              role="status"
              className={state.success ? "text-xs text-electric" : "text-xs text-red-400"}
            >
              {state.message}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}

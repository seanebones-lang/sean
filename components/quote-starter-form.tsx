"use client";

import { useActionState, useEffect } from "react";
import { track } from "@vercel/analytics";
import { submitQuoteLead } from "@/app/actions/quote-lead";

const initialState = { success: false, message: "" };

type QuoteStarterFormProps = {
  defaultIdea?: string;
  defaultStyleHint?: string;
  defaultPlacement?: string;
  source?: string;
};

const SIZE_OPTIONS = [
  { value: "", label: "Select size" },
  { value: "XS (<3 in)", label: "Extra small — coin to palm" },
  { value: "S (3–5 in)", label: "Small — business-card size" },
  { value: "M (5–8 in)", label: "Medium — forearm / calf" },
  { value: "L (8–14 in)", label: "Large — half-sleeve / thigh" },
  { value: "XL / sleeve", label: "Full sleeve / back piece" },
  { value: "Not sure", label: "Not sure yet" },
];

const PLACEMENT_OPTIONS = [
  "",
  "Arm / Sleeve",
  "Forearm",
  "Upper arm",
  "Hand / Fingers",
  "Chest",
  "Back",
  "Ribcage / Side",
  "Leg / Thigh",
  "Calf / Shin",
  "Foot / Ankle",
  "Neck",
  "Other / Not sure",
];

export function QuoteStarterForm({
  defaultIdea,
  defaultStyleHint,
  defaultPlacement,
  source,
}: QuoteStarterFormProps) {
  const [state, action, pending] = useActionState(submitQuoteLead, initialState);

  useEffect(() => {
    if (state.success) {
      track("quote_lead_submitted", { source: source ?? "booking" });
    }
  }, [state.success, source]);

  return (
    <div className="section-card rounded-xl p-5">
      <h2 className="section-title mb-1 text-sm text-electric">Quick quote starter</h2>
      <p className="text-sm text-muted-foreground">
        Not ready for the full booking form? Share a few details and Sean will follow up with an estimate.
      </p>

      <form action={action} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          <span>Your name</span>
          <input
            type="text"
            name="name"
            required
            minLength={2}
            placeholder="Jane Doe"
            className="min-h-10 rounded-lg border border-border bg-black/30 px-3 py-2 text-sm text-foreground outline-none focus:border-electric"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          <span>Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="min-h-10 rounded-lg border border-border bg-black/30 px-3 py-2 text-sm text-foreground outline-none focus:border-electric"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted-foreground sm:col-span-2">
          <span>Your idea</span>
          <textarea
            name="idea"
            required
            minLength={10}
            rows={3}
            defaultValue={defaultIdea}
            placeholder="e.g. Black & grey snake wrapping the forearm, medium detail."
            className="min-h-[5rem] rounded-lg border border-border bg-black/30 px-3 py-2 text-sm text-foreground outline-none focus:border-electric"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          <span>Size</span>
          <select
            name="size"
            className="min-h-10 rounded-lg border border-border bg-black/30 px-3 py-2 text-sm text-foreground outline-none focus:border-electric"
          >
            {SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          <span>Placement</span>
          <select
            name="placement"
            defaultValue={defaultPlacement ?? ""}
            className="min-h-10 rounded-lg border border-border bg-black/30 px-3 py-2 text-sm text-foreground outline-none focus:border-electric"
          >
            {PLACEMENT_OPTIONS.map((value) => (
              <option key={value || "unset"} value={value}>
                {value || "Select placement"}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted-foreground sm:col-span-2">
          <span>Style interest (optional)</span>
          <input
            type="text"
            name="styleHint"
            defaultValue={defaultStyleHint}
            placeholder="Fine line, black & grey, realism…"
            className="min-h-10 rounded-lg border border-border bg-black/30 px-3 py-2 text-sm text-foreground outline-none focus:border-electric"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted-foreground sm:col-span-2">
          <span>Referral code (optional)</span>
          <input
            type="text"
            name="referralCode"
            placeholder="Friend's code or campaign tag"
            className="min-h-10 rounded-lg border border-border bg-black/30 px-3 py-2 text-sm text-foreground outline-none focus:border-electric"
          />
        </label>

        <div className="hidden" aria-hidden>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="electric-ring min-h-10 rounded-full border border-electric px-5 py-2 text-xs font-semibold uppercase tracking-widest text-foreground hover:text-electric disabled:opacity-70"
          >
            {pending ? "Sending…" : "Send quote request"}
          </button>
          {state.message ? (
            <p
              role="status"
              className={state.success ? "text-xs text-electric" : "text-xs text-red-400"}
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}

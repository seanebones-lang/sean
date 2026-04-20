"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions/contact";

const initialState = { success: false, message: "" };

const PLACEMENTS = [
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
  "Head / Face",
  "Other",
];

const SIZES = [
  { value: "small", label: 'Small (under 3")' },
  { value: "medium", label: 'Medium (3"–6")' },
  { value: "large", label: 'Large (6"–12")' },
  { value: "xl", label: 'XL / Full piece (12"+)' },
  { value: "full_sleeve", label: "Full sleeve / large area" },
];

const BUDGETS = [
  { value: "under_200", label: "Under $200" },
  { value: "200_500", label: "$200–$500" },
  { value: "500_1000", label: "$500–$1,000" },
  { value: "1000_2500", label: "$1,000–$2,500" },
  { value: "2500_plus", label: "$2,500+" },
  { value: "unsure", label: "Not sure yet" },
];

const inputClass =
  "min-h-11 rounded-lg border border-border bg-black/30 px-3 py-2 text-base outline-none focus:border-electric w-full";
const labelClass = "block text-sm text-muted-foreground mb-1";
const selectClass =
  "min-h-11 w-full rounded-lg border border-border bg-black/30 px-3 py-2 text-base text-foreground outline-none focus:border-electric appearance-none";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);

  return (
    <form action={action} className="section-card grid gap-5 rounded-xl p-4 min-[480px]:p-6">
      {/* Name + Email row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name <span aria-hidden className="text-electric">*</span>
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span aria-hidden className="text-electric">*</span>
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" autoComplete="off" tabIndex={-1} />
      </div>

      {/* Idea */}
      <div>
        <label htmlFor="idea" className={labelClass}>
          Tattoo concept <span aria-hidden className="text-electric">*</span>
        </label>
        <textarea
          id="idea"
          name="idea"
          required
          minLength={20}
          rows={4}
          placeholder="Describe your idea — subject, style, references, mood..."
          className={`${inputClass} min-h-[8rem]`}
        />
      </div>

      {/* Placement + Size row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="placement" className={labelClass}>
            Placement
          </label>
          <select id="placement" name="placement" className={selectClass}>
            <option value="">Select area...</option>
            {PLACEMENTS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="size" className={labelClass}>
            Approximate size
          </label>
          <select id="size" name="size" className={selectClass}>
            <option value="">Select size...</option>
            {SIZES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Color preference */}
      <fieldset className="grid gap-2">
        <legend className={labelClass}>Color preference</legend>
        <div className="flex flex-wrap gap-3">
          {[
            { value: "black_grey", label: "Black & Grey" },
            { value: "color", label: "Full Color" },
            { value: "black_red", label: "Black & Red" },
            { value: "unsure", label: "Open / unsure" },
          ].map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <input
                type="radio"
                name="colorPreference"
                value={opt.value}
                className="accent-[#21c7ff]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Budget + Timeline row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="budget" className={labelClass}>
            Budget range
          </label>
          <select id="budget" name="budget" className={selectClass}>
            <option value="">Select range...</option>
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="timeline" className={labelClass}>
            Timeline
          </label>
          <select id="timeline" name="timeline" className={selectClass}>
            <option value="">Select timeline...</option>
            <option value="asap">As soon as possible</option>
            <option value="1_3mo">1–3 months</option>
            <option value="3_6mo">3–6 months</option>
            <option value="flexible">Flexible / no rush</option>
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2.5">
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="firstTattoo"
            value="yes"
            className="mt-0.5 accent-[#21c7ff]"
          />
          This would be my first tattoo
        </label>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="coverUp"
            value="yes"
            className="mt-0.5 accent-[#21c7ff]"
          />
          This is a cover-up or rework of existing ink
        </label>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="ageConfirm"
            value="yes"
            required
            className="mt-0.5 accent-[#21c7ff]"
          />
          I confirm I am 18 years of age or older <span aria-hidden className="text-electric">*</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="electric-ring min-h-12 touch-manipulation rounded-full border border-electric px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] disabled:opacity-70"
      >
        {pending ? "Sending..." : "Send Request"}
      </button>

      {state.message ? (
        <p
          role="status"
          className={state.success ? "text-sm text-electric" : "text-sm text-red-400"}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

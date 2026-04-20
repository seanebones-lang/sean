type PricingRow = {
  label: string;
  range: string;
  note?: string;
};

const DEFAULT_ROWS: PricingRow[] = [
  { label: "Studio minimum", range: "$150", note: "Any piece, any size — covers setup and supplies." },
  { label: "Small black & grey", range: "$200–$400", note: "Coin to palm size, single session." },
  { label: "Medium color or fine line", range: "$400–$900", note: "Forearm / calf — detailed." },
  { label: "Half-sleeve / thigh", range: "$900–$1,800", note: "Multi-session, typically 2–3 sittings." },
  { label: "Full day session", range: "$1,200+", note: "6+ hours, flat rate — ideal for sleeves & back pieces." },
];

export function PricingBand({ rows = DEFAULT_ROWS }: { rows?: PricingRow[] }) {
  return (
    <div className="section-card rounded-xl p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="section-title text-sm text-electric">Starting estimates</h2>
        <p className="text-xs text-muted-foreground">Final quote is given after consultation.</p>
      </div>
      <ul className="mt-3 divide-y divide-border">
        {rows.map((row) => (
          <li key={row.label} className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">{row.label}</p>
              {row.note ? (
                <p className="text-xs text-muted-foreground">{row.note}</p>
              ) : null}
            </div>
            <p className="text-sm font-semibold text-electric">{row.range}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Design complexity, placement difficulty, and session length all affect the final number.
        A non-refundable deposit holds your appointment and applies to your final total.
      </p>
    </div>
  );
}

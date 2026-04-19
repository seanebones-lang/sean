import { Link } from "@/i18n/navigation";

type BookingCtaProps = {
  href?: string;
  label?: string;
  sub?: string;
};

export function BookingCta({
  href = "/booking",
  label = "Ready to get tattooed?",
  sub = "Book a consultation — deposits hold your spot.",
}: BookingCtaProps) {
  return (
    <div className="section-card rounded-xl p-5 text-center">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      <Link
        href={href}
        className="electric-ring mt-4 inline-flex touch-manipulation items-center justify-center rounded-full border border-electric px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-foreground hover:text-electric"
      >
        Book Now
      </Link>
    </div>
  );
}

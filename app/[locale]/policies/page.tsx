import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/page-shell";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

type PoliciesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PoliciesPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Studio Policies",
    description: "Booking policies covering deposits, cancellations, pricing, health requirements, and touch-up coverage.",
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/policies` },
    openGraph: {
      title: "Studio Policies — Cody Meneley",
      description: "Deposit, cancellation, and studio policies. Read before booking your appointment.",
      url: `${siteConfig.siteUrl}/${locale}/policies`,
    },
  };
}

const sections = [
  {
    heading: "Deposits",
    items: [
      "A non-refundable deposit is required to secure every appointment.",
      "Deposit amounts vary by project scope — typically $50–$200.",
      "Your deposit is applied toward the final session price.",
      "Deposits are forfeited on no-shows or last-minute cancellations (< 48 hours notice).",
    ],
  },
  {
    heading: "Cancellations & rescheduling",
    items: [
      "Please give at least 48 hours notice if you need to reschedule.",
      "One reschedule per deposit is allowed — your deposit transfers with you.",
      "Repeated last-minute cancellations will require a new deposit.",
      "No-shows forfeit their deposit and may be declined future bookings.",
    ],
  },
  {
    heading: "Pricing",
    items: [
      "All pricing is quoted after consultation — final cost depends on size, complexity, and placement.",
      "Session pricing is calculated by time or by piece, agreed upon before your appointment.",
      "Large multi-session projects are quoted as a full package.",
    ],
  },
  {
    heading: "Health & safety",
    items: [
      "You must be 18 or older to receive a tattoo. Valid photo ID required.",
      "Do not arrive under the influence of alcohol or substances.",
      "Certain medical conditions may affect eligibility — disclose these at consultation.",
      "Pregnant or breastfeeding clients cannot be tattooed.",
    ],
  },
  {
    heading: "Touch-ups",
    items: [
      "One complimentary touch-up is included within 3 months of your session.",
      "Touch-ups must be booked after the tattoo is fully healed (typically 4–6 weeks).",
      "Touch-ups resulting from aftercare negligence are not covered.",
    ],
  },
];

export default async function PoliciesPage({ params }: PoliciesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell
      title="Policies"
      description="Booking and studio policies are designed to keep projects clear, fair, and professional for everyone."
    >
      <div className="grid gap-6">
        {sections.map((section) => (
          <div key={section.heading} className="section-card rounded-xl p-6">
            <h2 className="section-title text-sm text-electric">{section.heading}</h2>
            <ul className="mt-3 space-y-2">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 text-electric/50" aria-hidden>–</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Questions about these policies?{" "}
        <Link href="/contact" className="text-electric hover:underline">Contact us</Link>{" "}
        before booking.
      </p>
    </PageShell>
  );
}

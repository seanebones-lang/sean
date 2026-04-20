import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/page-shell";
import { getAftercarePage } from "@/lib/sanity/aftercare";
import { PrintButton } from "./print-button";
import { siteConfig } from "@/lib/site";

type AftercarePageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: AftercarePageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Aftercare Guide",
    description: "Step-by-step tattoo aftercare instructions. How to wash, moisturize, and protect your tattoo for the best healed result.",
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/aftercare` },
    openGraph: {
      title: "Tattoo Aftercare Guide — Cody Meneley",
      description: "Take-home aftercare steps to keep your tattoo healing cleanly. Printable format included.",
      url: `${siteConfig.siteUrl}/${locale}/aftercare`,
    },
  };
}

const FALLBACK_STEPS = [
  {
    heading: "Leave the initial wrap on",
    body: "Keep your bandage or second-skin wrap on for the timeframe your artist advises — usually 2–4 hours for regular wrap, 3–5 days for second skin.",
  },
  {
    heading: "Wash gently",
    body: "Use fragrance-free soap and lukewarm water. Lather with clean fingertips — no washcloths or sponges. Pat dry with a clean paper towel.",
  },
  {
    heading: "Moisturize sparingly",
    body: "Apply a thin layer of recommended aftercare product (Aquaphor, Hustle Butter, or unscented lotion). Thin layers only — thick coatings suffocate the skin.",
  },
  {
    heading: "Protect from sun and water",
    body: "Avoid direct sun exposure, pools, hot tubs, and soaking baths for at least 2–3 weeks. Once fully healed, use SPF 50+ to protect the color.",
  },
  {
    heading: "Do not pick or scratch",
    body: "Peeling and flaking is normal. Picking pulls out ink and can cause scarring. If it itches, slap gently — never scratch.",
  },
];

const FALLBACK_WARNING =
  "Contact your artist or a medical professional immediately if you notice excessive redness, swelling, heat, or discharge — these can be signs of infection.";

export default async function AftercarePage({ params }: AftercarePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = await getAftercarePage();

  const pageTitle = data?.title?.trim() || "Aftercare Guide";
  const intro =
    data?.intro?.trim() ||
    "Healing quality is part of the final result. Follow these steps carefully after every session.";
  const steps = data?.steps?.length ? data.steps : FALLBACK_STEPS;
  const warning = data?.warningNote?.trim() || FALLBACK_WARNING;
  const products = data?.productRecommendations?.trim();

  return (
    <>
      {/* Print-only header */}
      <div className="hidden print:block mb-6">
        <p className="text-xs uppercase tracking-widest text-gray-500">Tattoo Aftercare — take this home</p>
        <h1 className="mt-1 text-2xl font-bold">{pageTitle}</h1>
        <p className="mt-1 text-sm text-gray-600">{intro}</p>
        <hr className="mt-4 border-gray-300" />
      </div>

      <PageShell title={pageTitle} description={intro}>
        {/* Print button — screen only */}
        <div className="print:hidden mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Steps {steps.length} · {Math.ceil(steps.length * 0.5)} min read
          </p>
          <PrintButton />
        </div>

        {/* Warning callout */}
        <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 print:border-amber-700 print:text-gray-800">
          <span className="font-semibold">Important: </span>{warning}
        </div>

        {/* Steps */}
        <ol className="grid gap-4">
          {steps.map((step, index) => (
            <li key={step.heading} className="section-card rounded-xl p-5 print:border print:border-gray-200 print:shadow-none">
              <p className="text-xs uppercase tracking-widest text-electric print:text-gray-500">
                Step {index + 1}
              </p>
              <p className="mt-1 font-semibold text-foreground print:text-gray-900">{step.heading}</p>
              {step.body ? (
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground print:text-gray-700">
                  {step.body}
                </p>
              ) : null}
            </li>
          ))}
        </ol>

        {/* Recommended products */}
        {products ? (
          <div className="mt-6 rounded-xl border border-border p-5 print:border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-widest text-electric print:text-gray-500">
              Recommended products
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground print:text-gray-700 whitespace-pre-line">
              {products}
            </p>
          </div>
        ) : null}

        {/* Print footer */}
        <div className="hidden print:block mt-8 border-t border-gray-300 pt-4 text-xs text-gray-500">
          Questions? Reach out before you pick at it.
        </div>
      </PageShell>
    </>
  );
}

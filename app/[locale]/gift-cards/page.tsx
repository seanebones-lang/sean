import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/page-shell";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { GiftCardButton } from "@/components/gift-card-button";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Gift Cards",
    description:
      "Give the gift of custom tattoo work — studio gift cards from Sean E Bones, redeemable on consultations, deposits, and sessions.",
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/gift-cards` },
    openGraph: {
      title: "Tattoo Gift Cards — Sean E Bones",
      description: "Give the gift of custom tattoo work — redeemable on consultations, deposits, and sessions.",
      url: `${siteConfig.siteUrl}/${locale}/gift-cards`,
    },
  };
}

export default async function GiftCardsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const giftUrl = siteConfig.giftCardUrl;

  return (
    <PageShell
      title="Gift Cards"
      description="The easiest thoughtful gift for anyone who has been thinking about getting tattooed."
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="section-card rounded-xl p-6">
          <h2 className="section-title text-lg text-foreground">How it works</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>1. Pick an amount — $100, $250, $500, or custom.</li>
            <li>2. Checkout securely via our payment provider.</li>
            <li>3. You receive a code by email to share with your recipient.</li>
            <li>4. They apply it to a consultation deposit or session balance.</li>
          </ol>
          {giftUrl ? (
            <div className="mt-5">
              <GiftCardButton href={giftUrl} label="Buy a gift card" />
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted-foreground">
              Gift cards are being finalized. In the meantime, reach out via{" "}
              <Link href="/contact" className="text-electric hover:underline">contact</Link>{" "}
              to arrange a custom voucher.
            </p>
          )}
        </div>

        <div className="section-card rounded-xl p-6">
          <h2 className="section-title text-lg text-foreground">Good to know</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Gift cards do not expire.</li>
            <li>• Redeemable on consultations, deposits, or final session balance.</li>
            <li>• Non-refundable, but fully transferable.</li>
            <li>• Ask about corporate or group amounts.</li>
          </ul>
          <p className="mt-5 text-xs text-muted-foreground">
            Questions?{" "}
            <Link href="/contact" className="text-electric hover:underline">Message Sean</Link>.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

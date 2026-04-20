import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/page-shell";
import { getBookingPortalUrls } from "./booking-portal";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;

type BookingPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Book a Tattoo",
    description: "Schedule a tattoo appointment or submit a booking inquiry. Custom designs, consultations, and deposits handled here.",
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/booking` },
    openGraph: {
      title: "Book a Tattoo — Cody Meneley",
      description: "Ready to get tattooed? Book your appointment, submit a deposit, or reach out with your concept.",
      url: `${siteConfig.siteUrl}/${locale}/booking`,
    },
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("booking");

  const { bookingUrl, depositUrl } = await getBookingPortalUrls();
  const hasBooking = Boolean(bookingUrl);
  const hasDeposit = Boolean(depositUrl);

  return (
    <PageShell title={t("title")} description={t("description")}>
      {!hasBooking && !hasDeposit ? (
        <div className="section-card rounded-xl p-6">
          <p className="text-muted-foreground">{t("emptyHelp")}</p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>{t("emptySanity")}</li>
            <li>{t("emptyEnv")}</li>
          </ul>
        </div>
      ) : (
        <div
          className={
            hasBooking && hasDeposit ? "grid gap-6 lg:grid-cols-2 lg:items-start" : "grid gap-6"
          }
        >
          {hasBooking ? (
            <div className="min-w-0">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-electric">{t("scheduleHeading")}</h2>
              <div className="section-card overflow-hidden rounded-xl">
                <iframe
                  src={bookingUrl}
                  title={t("iframeTitle")}
                  className="h-[min(100dvh,56rem)] min-h-[32rem] w-full bg-surface sm:min-h-[40rem] lg:h-[900px] lg:min-h-0"
                  loading="lazy"
                />
              </div>
              <div className="mt-3">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-electric underline-offset-4 hover:underline"
                >
                  {t("openBookingTab")}
                </a>
              </div>
            </div>
          ) : null}

          {hasDeposit ? (
            <div className="min-w-0">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-electric">{t("depositHeading")}</h2>
              <div className="section-card flex flex-col gap-4 rounded-xl p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{t("depositBody")}</p>
                <a
                  href={depositUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="electric-ring inline-flex w-fit touch-manipulation items-center justify-center rounded-full border border-electric px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-foreground hover:text-electric"
                >
                  {t("depositCta")}
                </a>
                <p className="text-xs text-muted-foreground">{t("depositNote")}</p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {hasBooking && !hasDeposit ? (
        <p className="mt-6 max-w-2xl text-sm text-muted-foreground">{t("depositOptionalHint")}</p>
      ) : null}

      {/* Trust signals */}
      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          { icon: "🔒", heading: "Secure & private", body: "Your personal details are never shared with third parties." },
          { icon: "💬", heading: "No commitment yet", body: "Booking a consult is free — you approve the design before any deposit." },
          { icon: "📋", heading: "Deposit policy", body: "Deposits are required to hold your appointment. See our policies for full details." },
        ].map((item) => (
          <div key={item.heading} className="section-card rounded-xl p-4 text-sm">
            <p className="text-xl">{item.icon}</p>
            <p className="mt-2 font-semibold text-foreground">{item.heading}</p>
            <p className="mt-1 text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>

      {/* Quick FAQ */}
      <div className="mt-8">
        <h2 className="section-title text-sm text-muted-foreground">Common questions</h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { q: "How much does a tattoo cost?", a: "Pricing depends on size, complexity, and placement. Minimum is $100. Custom pieces are quoted after your consultation." },
            { q: "How big is the deposit?", a: "Deposits are typically $50–$200 depending on project scope. This is deducted from your final session price." },
            { q: "Can I get a custom design?", a: "Yes — all custom work is discussed at consultation. You'll see the design before we book your session." },
            { q: "What should I bring?", a: "Arrive clean, hydrated, and having eaten. Wear or bring loose clothing that gives access to the tattoo area." },
          ].map((item) => (
            <div key={item.q} className="section-card rounded-xl p-4">
              <dt className="text-sm font-semibold text-foreground">{item.q}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">
          More questions?{" "}
          <Link href="/faq" className="text-electric hover:underline">Read the full FAQ</Link>
          {" or "}
          <Link href="/contact" className="text-electric hover:underline">contact us directly</Link>.
        </p>
      </div>
    </PageShell>
  );
}

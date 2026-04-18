import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/page-shell";
import { siteConfig } from "@/lib/site";

type BookingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("booking");

  const bookingUrl = siteConfig.bookingUrl;

  return (
    <PageShell title={t("title")} description={t("description")}>
      {bookingUrl ? (
        <div className="section-card overflow-hidden rounded-xl">
          <iframe
            src={bookingUrl}
            title="Booking portal"
            className="h-[min(100dvh,56rem)] min-h-[32rem] w-full bg-surface sm:min-h-[40rem] lg:h-[900px] lg:min-h-0"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="section-card rounded-xl p-6">
          <p className="text-muted-foreground">
            Add your booking URL in <code>NEXT_PUBLIC_BOOKING_URL</code> to render the embedded
            booking experience.
          </p>
        </div>
      )}

      {bookingUrl ? (
        <div className="mt-4">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-electric underline-offset-4 hover:underline"
          >
            Open booking in a new tab
          </a>
        </div>
      ) : null}
    </PageShell>
  );
}

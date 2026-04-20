import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/page-shell";
import { ContactForm } from "./contact-form";
import { siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/lib/sanity/site-settings";
import { Link } from "@/i18n/navigation";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Contact",
    description: "Send a booking inquiry or general message. Include your concept, placement, size, and reference images to get started.",
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/contact` },
    openGraph: {
      title: "Contact Sean E Bones — Tattoo Booking Inquiry",
      description: "Ready to start your project? Send your concept, placement, and reference images and we'll be in touch.",
      url: `${siteConfig.siteUrl}/${locale}/contact`,
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const settings = await getSiteSettings();

  const phone = settings?.phoneNumber?.trim();
  const address = settings?.studioAddress?.trim();
  const hours = settings?.businessHours?.trim();
  const instagram = settings?.instagramUrl?.trim() || siteConfig.instagram;
  const email = settings?.contactEmail?.trim() || siteConfig.email;

  return (
    <PageShell title={t("title")} description={t("description")}>
      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        <ContactForm />

        {/* Contact sidebar */}
        <aside className="space-y-4 text-sm">
          {(phone || address || hours) ? (
            <div className="section-card rounded-xl p-5">
              <p className="section-title mb-3 text-xs text-foreground">Studio</p>
              <dl className="space-y-2 text-muted-foreground">
                {address ? (
                  <div>
                    <dt className="sr-only">Address</dt>
                    <dd className="whitespace-pre-line">{address}</dd>
                  </div>
                ) : null}
                {phone ? (
                  <div>
                    <dt className="sr-only">Phone</dt>
                    <dd>
                      <a href={`tel:${phone}`} className="hover:text-electric">{phone}</a>
                    </dd>
                  </div>
                ) : null}
                {hours ? (
                  <div className="pt-1">
                    <dt className="sr-only">Hours</dt>
                    <dd className="whitespace-pre-line">{hours}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}

          <div className="section-card rounded-xl p-5">
            <p className="section-title mb-3 text-xs text-foreground">Connect</p>
            <div className="space-y-2 text-muted-foreground">
              {email ? (
                <p>
                  <a href={`mailto:${email}`} className="hover:text-electric">{email}</a>
                </p>
              ) : null}
              {instagram ? (
                <p>
                  <a href={instagram} target="_blank" rel="noreferrer" className="hover:text-electric">
                    Instagram →
                  </a>
                </p>
              ) : null}
            </div>
          </div>

          <div className="section-card rounded-xl p-5">
            <p className="section-title mb-2 text-xs text-foreground">Response time</p>
            <p className="text-muted-foreground">Most inquiries are answered within 2–3 business days.</p>
            <p className="mt-2 text-muted-foreground">For faster booking, use the{" "}
              <Link href="/booking" className="text-electric hover:underline">booking portal</Link>.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

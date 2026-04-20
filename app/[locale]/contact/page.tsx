import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/page-shell";
import { ContactForm } from "./contact-form";
import { siteConfig } from "@/lib/site";

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
      title: "Contact Cody Meneley — Tattoo Booking Inquiry",
      description: "Ready to start your project? Send your concept, placement, and reference images and we'll be in touch.",
      url: `${siteConfig.siteUrl}/${locale}/contact`,
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <PageShell title={t("title")} description={t("description")}>
      <ContactForm />
    </PageShell>
  );
}

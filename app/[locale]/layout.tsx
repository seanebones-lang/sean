import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BackToTop } from "@/components/back-to-top";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050607",
};

export async function generateMetadata({
  params,
}: Omit<LocaleLayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("title"),
      template: `%s | Cody Meneley`,
    },
    description: t("description"),
    metadataBase: new URL(siteConfig.siteUrl),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `/${locale}`,
      siteName: "Cody Meneley — Tattoo Artist",
      locale: locale === "es" ? "es_ES" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: `${siteConfig.siteUrl}/${locale}`,
      languages: {
        en: `${siteConfig.siteUrl}/en`,
        es: `${siteConfig.siteUrl}/es`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="layout-shell min-h-screen bg-background pb-[env(safe-area-inset-bottom)] text-foreground">
        <NextIntlClientProvider messages={messages}>
          {/* Skip to main content — visually hidden until focused */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[500] focus:rounded-lg focus:border focus:border-electric focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:text-electric focus:outline-none"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <BackToTop />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

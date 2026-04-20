import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/lib/sanity/site-settings";

export async function SiteFooter() {
  const t = await getTranslations("common");
  const settings = await getSiteSettings();

  const bio =
    settings?.footerBio?.trim() ||
    "Tattooing since 2004. Sponsored artist. Black and grey specialist.";
  const instagram = settings?.instagramUrl?.trim() || siteConfig.instagram;
  const facebook = settings?.facebookUrl?.trim() || siteConfig.facebook;
  const tiktok = settings?.tiktokUrl?.trim();
  const hours = settings?.businessHours?.trim();
  const address = settings?.studioAddress?.trim();
  const phone = settings?.phoneNumber?.trim();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-8 px-3 py-8 min-[480px]:px-4 sm:px-6 sm:py-10 lg:grid lg:grid-cols-4 lg:gap-10">
        <div className="lg:col-span-2">
          <p className="section-title text-xl text-foreground">
            {settings?.siteName?.trim() || siteConfig.name}
          </p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground whitespace-pre-line">{bio}</p>
        </div>

        <div className="text-sm">
          <p className="section-title text-xs text-foreground">Studio</p>
          <dl className="mt-2 space-y-1 text-muted-foreground">
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

        <div className="flex flex-wrap gap-2 text-sm lg:flex-col lg:items-start lg:gap-1">
          <p className="section-title mb-1 hidden text-xs text-foreground lg:block">Connect</p>
          {instagram ? (
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 touch-manipulation items-center rounded-lg px-2 text-muted-foreground hover:bg-surface hover:text-electric"
            >
              {t("instagram")}
            </a>
          ) : null}
          {facebook ? (
            <a
              href={facebook}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 touch-manipulation items-center rounded-lg px-2 text-muted-foreground hover:bg-surface hover:text-electric"
            >
              {t("facebook")}
            </a>
          ) : null}
          {tiktok ? (
            <a
              href={tiktok}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 touch-manipulation items-center rounded-lg px-2 text-muted-foreground hover:bg-surface hover:text-electric"
            >
              TikTok
            </a>
          ) : null}
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-4 text-xs text-muted-foreground min-[480px]:px-4 sm:px-6">
          <span>
            © {new Date().getFullYear()} {settings?.siteName?.trim() || siteConfig.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

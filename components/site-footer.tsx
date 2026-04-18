import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const t = useTranslations("common");

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-6 px-3 py-8 min-[480px]:px-4 sm:px-6 sm:py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-title text-xl text-foreground">Cody Meneley</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tattooing since 2004. Sponsored artist. Black and grey specialist.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm min-[480px]:gap-4">
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 touch-manipulation items-center rounded-lg px-2 text-muted-foreground hover:bg-surface hover:text-electric min-[480px]:px-1"
          >
            {t("instagram")}
          </a>
          <a
            href={siteConfig.facebook}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 touch-manipulation items-center rounded-lg px-2 text-muted-foreground hover:bg-surface hover:text-electric min-[480px]:px-1"
          >
            {t("facebook")}
          </a>
        </div>
      </div>
    </footer>
  );
}

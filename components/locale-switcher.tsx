"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const onLocaleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: event.target.value });
  };

  return (
    <label className="inline-flex max-w-full items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground min-[400px]:gap-2 min-[400px]:text-xs min-[400px]:tracking-[0.18em]">
      <span className="hidden min-[420px]:inline">{t("localeLabel")}</span>
      <select
        aria-label={t("localeLabel")}
        value={locale}
        onChange={onLocaleChange}
        className="min-h-9 min-w-[3.25rem] max-w-full touch-manipulation rounded-md border border-border bg-surface px-1.5 py-1.5 text-sm text-foreground outline-none focus:border-electric min-[400px]:px-2 min-[400px]:text-base"
      >
        {routing.locales.map((item) => (
          <option key={item} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}

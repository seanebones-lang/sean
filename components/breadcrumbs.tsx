import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
  locale?: string;
};

export function Breadcrumbs({ items, locale = "en" }: BreadcrumbsProps) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${siteConfig.siteUrl}/${locale}${crumb.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((crumb, i) => (
          <span key={`${crumb.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden>/</span> : null}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-electric">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

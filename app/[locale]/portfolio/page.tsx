import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/page-shell";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { MobileBookCta } from "@/components/mobile-book-cta";
import { sanityEnv } from "@/sanity/env";
import { getPortfolioPieces } from "./portfolio-data";

export const revalidate = 60;

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const portfolio = await getPortfolioPieces();
  const pieces = portfolio.pieces;
  const fetchError = portfolio.ok ? undefined : portfolio.error;

  const description = pieces.length
    ? `${pieces.length} piece${pieces.length === 1 ? "" : "s"} from the studio. Click any piece to view full detail and all images.`
    : fetchError
      ? "We could not load portfolio content from Sanity."
      : sanityEnv.isConfigured
        ? "No portfolio pieces yet, or none are published. Add images and publish a Portfolio Piece in Sanity."
        : "Set Sanity project id and dataset in environment variables (see .env.example).";

  return (
    <>
    <MobileBookCta />
    <PageShell title="Portfolio" description={description}>
      {fetchError ? (
        <p className="mb-6 max-w-2xl rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <span className="font-medium">Sanity: </span>
          {fetchError}
          <span className="mt-2 block text-xs text-amber-100/80">
            On Vercel, set SANITY_PROJECT_ID and SANITY_DATASET (or NEXT_PUBLIC_SANITY_*), then
            redeploy. Check Deployment Logs if this persists.
          </span>
        </p>
      ) : null}

      {pieces.length ? (
        <PortfolioGrid pieces={pieces} />
      ) : !fetchError ? (
        <p className="max-w-xl text-sm text-muted-foreground">
          {sanityEnv.isConfigured
            ? "Open Sanity Studio, open a Portfolio Piece, add at least one image in the Images field, and click Publish."
            : "Set SANITY_PROJECT_ID and SANITY_DATASET (or NEXT_PUBLIC_SANITY_*) in .env.local so the site can fetch content."}
        </p>
      ) : null}
    </PageShell>
    </>
  );
}

import { Link } from "@/i18n/navigation";

export default function LocaleNotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-20 text-center">
      <p className="section-title text-[clamp(4rem,12vw,8rem)] leading-none text-electric">404</p>
      <h1 className="mt-4 section-title text-2xl text-foreground sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 text-muted-foreground">
        The page you're looking for doesn't exist, or the artwork has moved. Browse the portfolio
        or head home.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/portfolio"
          className="electric-ring min-h-11 rounded-full border border-electric px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground hover:text-electric"
        >
          View portfolio
        </Link>
        <Link
          href="/"
          className="min-h-11 rounded-full border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:border-electric/40 hover:text-electric"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

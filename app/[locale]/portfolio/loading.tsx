export default function PortfolioLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
      <div className="mb-6 max-w-3xl">
        <div className="h-12 w-48 animate-pulse rounded-lg bg-surface" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-surface" />
      </div>

      {/* Filter chips skeleton */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 animate-pulse rounded-full bg-surface"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-surface"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="aspect-[4/5] w-full animate-pulse bg-gradient-to-br from-surface to-black" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
              <div className="h-3 w-full animate-pulse rounded bg-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

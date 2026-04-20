export default function PortfolioPieceLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-6 h-4 w-56 animate-pulse rounded bg-surface" />

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        {/* Gallery skeleton */}
        <div className="min-w-0 space-y-3">
          <div className="aspect-[4/5] w-full animate-pulse rounded-xl bg-surface" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-16 flex-none animate-pulse rounded-lg bg-surface"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Info sidebar */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-3">
            <div className="h-9 w-3/4 animate-pulse rounded-lg bg-surface" />
            {/* Tags */}
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-5 w-16 animate-pulse rounded-full bg-surface"
                  style={{ animationDelay: `${i * 40}ms` }}
                />
              ))}
            </div>
            <div className="h-3 w-24 animate-pulse rounded bg-surface" />
            {/* Description */}
            <div className="space-y-2 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded bg-surface"
                  style={{ width: i === 2 ? "70%" : "100%", animationDelay: `${i * 30}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Artist card */}
          <div className="h-24 animate-pulse rounded-xl bg-surface" style={{ animationDelay: "100ms" }} />
          {/* Booking CTA */}
          <div className="h-28 animate-pulse rounded-xl bg-surface" style={{ animationDelay: "140ms" }} />
          {/* Share */}
          <div className="h-20 animate-pulse rounded-xl bg-surface" style={{ animationDelay: "180ms" }} />
        </div>
      </div>

      {/* Related work */}
      <div className="mt-16">
        <div className="mb-6 h-6 w-32 animate-pulse rounded-lg bg-surface" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-xl bg-surface"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

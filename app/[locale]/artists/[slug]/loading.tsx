export default function ArtistDetailLoading() {
  return (
    <>
      {/* Cover banner skeleton */}
      <div className="h-[min(40dvh,18rem)] w-full animate-pulse bg-surface" />

      <div className="mx-auto w-full max-w-6xl min-w-0 px-3 pb-16 min-[480px]:px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="pt-6 mb-4 h-4 w-48 animate-pulse rounded bg-surface" />

        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          {/* Left — bio + portfolio */}
          <div className="space-y-8">
            {/* Profile + name */}
            <div className="flex items-end gap-5">
              <div className="h-24 w-24 flex-none animate-pulse rounded-full bg-surface ring-2 ring-border" />
              <div className="space-y-2">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-surface" />
                <div className="h-4 w-32 animate-pulse rounded bg-surface" />
                <div className="h-6 w-28 animate-pulse rounded-full bg-surface" />
              </div>
            </div>

            {/* Specialties chips */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-20 animate-pulse rounded-full bg-surface"
                  style={{ animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded bg-surface"
                  style={{ width: i === 3 ? "60%" : "100%", animationDelay: `${i * 30}ms` }}
                />
              ))}
            </div>

            {/* Portfolio grid */}
            <div>
              <div className="mb-4 h-6 w-40 animate-pulse rounded-lg bg-surface" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] animate-pulse rounded-xl bg-surface"
                    style={{ animationDelay: `${i * 60}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Booking card */}
            <div className="h-32 animate-pulse rounded-xl bg-surface" style={{ animationDelay: "80ms" }} />
            {/* Pricing */}
            <div className="h-40 animate-pulse rounded-xl bg-surface" style={{ animationDelay: "120ms" }} />
            {/* Studio info */}
            <div className="h-48 animate-pulse rounded-xl bg-surface" style={{ animationDelay: "160ms" }} />
            {/* Socials */}
            <div className="h-24 animate-pulse rounded-xl bg-surface" style={{ animationDelay: "200ms" }} />
          </div>
        </div>
      </div>
    </>
  );
}

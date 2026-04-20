export default function AboutLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
      {/* Title */}
      <div className="mb-8 max-w-3xl space-y-3">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-surface" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-surface" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-surface"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>

      {/* About cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-xl bg-surface"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>

      {/* Workflow */}
      <div className="mt-10">
        <div className="mb-4 h-6 w-44 animate-pulse rounded-lg bg-surface" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl bg-surface"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

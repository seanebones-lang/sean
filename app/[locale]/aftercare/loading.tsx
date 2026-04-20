export default function AftercareLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
      <div className="mb-8 max-w-3xl space-y-3">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-surface" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-surface" />
      </div>

      {/* Intro */}
      <div className="mb-8 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse rounded bg-surface"
            style={{ width: i === 2 ? "60%" : "100%", animationDelay: `${i * 30}ms` }}
          />
        ))}
      </div>

      {/* Steps */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl bg-surface"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>

      {/* Warning callout */}
      <div className="mt-8 h-24 animate-pulse rounded-xl bg-surface" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

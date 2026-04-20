export default function ArtistsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
      <div className="mb-6 max-w-3xl">
        <div className="h-12 w-32 animate-pulse rounded-lg bg-surface" />
        <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-surface" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl bg-surface" style={{ animationDelay: `${i * 60}ms` }} />
        ))}
      </div>
    </div>
  );
}

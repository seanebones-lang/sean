export default function TestimonialsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
      <div className="mb-6 max-w-3xl">
        <div className="h-12 w-48 animate-pulse rounded-lg bg-surface" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-surface" />
      </div>
      <div className="mb-6 h-20 animate-pulse rounded-xl bg-surface" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-surface" style={{ animationDelay: `${i * 50}ms` }} />
        ))}
      </div>
    </div>
  );
}

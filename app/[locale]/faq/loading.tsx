export default function FaqLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
      <div className="mb-8 max-w-3xl space-y-3">
        <div className="h-10 w-16 animate-pulse rounded-lg bg-surface" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-surface" />
      </div>
      <div className="grid gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-surface"
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

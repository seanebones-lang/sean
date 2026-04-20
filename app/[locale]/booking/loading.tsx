export default function BookingLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
      {/* Heading */}
      <div className="mb-8 max-w-3xl space-y-3">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-surface" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-surface" />
        <div className="h-4 w-72 animate-pulse rounded bg-surface" />
      </div>

      {/* Trust signals */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-surface"
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>

      {/* Booking iframe placeholder */}
      <div className="h-[600px] animate-pulse rounded-xl bg-surface" style={{ animationDelay: "200ms" }} />
    </div>
  );
}

export default function ContactLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
      <div className="mb-6 max-w-3xl">
        <div className="h-12 w-36 animate-pulse rounded-lg bg-surface" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-surface" />
      </div>
      <div className="grid gap-4 max-w-2xl">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-surface" style={{ animationDelay: `${i * 40}ms` }} />
        ))}
        <div className="h-28 animate-pulse rounded-xl bg-surface" />
        <div className="h-12 w-36 animate-pulse rounded-full bg-surface" />
      </div>
    </div>
  );
}

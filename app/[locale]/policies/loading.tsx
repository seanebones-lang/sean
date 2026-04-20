export default function PoliciesLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
      <div className="mb-8 max-w-3xl space-y-3">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-surface" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-surface" />
      </div>
      <div className="space-y-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="h-6 w-40 animate-pulse rounded-lg bg-surface" />
            <div className="space-y-2 pl-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="h-4 animate-pulse rounded bg-surface"
                  style={{ width: j === 2 ? "70%" : "100%", animationDelay: `${j * 30}ms` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

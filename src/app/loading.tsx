export default function Loading() {
  return (
    <main
      className="flex min-h-[70vh] items-center justify-center bg-background px-4 pt-20"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-7xl">
        <div className="mb-8 h-8 w-52 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-[2/3] animate-pulse bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
        <span className="sr-only">Đang tải nội dung</span>
      </div>
    </main>
  );
}

/* Ana sayfa yüklenirken görünür — Hero + kart iskelet */
export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Nav iskelet */}
      <div className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/80 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="flex gap-6">
            {[80, 64, 48, 72].map((w, i) => (
              <div key={i} className="h-3 rounded bg-muted" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      {/* Hero iskelet */}
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-40">
        <div className="mb-6 h-3 w-24 rounded bg-muted" />
        <div className="mb-4 h-16 w-3/4 rounded-lg bg-muted sm:h-20 lg:h-24" />
        <div className="mb-2 h-16 w-1/2 rounded-lg bg-muted sm:h-20 lg:h-24" />
        <div className="mt-8 h-5 w-96 max-w-full rounded bg-muted" />
        <div className="mt-3 h-5 w-72 max-w-full rounded bg-muted" />
        <div className="mt-10 h-10 w-40 rounded-lg bg-muted" />
      </div>

      {/* Kart ızgarası iskelet */}
      <div className="mx-auto max-w-6xl px-6 pb-32">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[16/10] w-full rounded-lg bg-muted" />
      <div className="h-3 w-20 rounded bg-muted" />
      <div className="h-5 w-4/5 rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-4 w-3/4 rounded bg-muted" />
    </div>
  )
}

/* Etkinlikler sayfası yüklenirken görünür */
export default function EventsLoading() {
  return (
    <div className="animate-pulse pb-32 pt-32">
      <div className="mx-auto max-w-6xl px-6">

        {/* Başlık iskelet */}
        <div className="mb-16 border-b border-border pb-10">
          <div className="mb-4 h-3 w-20 rounded bg-muted" />
          <div className="mb-3 h-14 w-80 rounded-lg bg-muted sm:h-16 lg:h-20" />
          <div className="h-5 w-96 max-w-full rounded bg-muted" />
        </div>

        {/* Öne çıkan etkinlik — 2 sütunlu */}
        <div className="mb-20 grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Sol: geri sayım iskelet */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="mb-6 h-3 w-28 rounded bg-muted" />
              <div className="mb-6 h-6 w-48 rounded bg-muted" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-xl bg-muted sm:h-32" />
                ))}
              </div>
            </div>
            <div className="flex gap-4 pl-1">
              <div className="h-3 w-32 rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
          </div>
          {/* Sağ: görsel + başlık iskelet */}
          <div className="flex flex-col gap-4">
            <div className="aspect-video max-h-80 w-full rounded-xl bg-muted" />
            <div className="h-7 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        </div>

        {/* Alt başlık */}
        <div className="mb-8 border-t border-border pt-16">
          <div className="h-3 w-32 rounded bg-muted" />
        </div>

        {/* Arama + filtre iskelet */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="h-10 flex-1 rounded-lg bg-muted" />
          <div className="flex gap-2">
            {[56, 80, 68, 60, 72].map((w, i) => (
              <div key={i} className="h-8 rounded-full bg-muted" style={{ width: w }} />
            ))}
          </div>
        </div>

        {/* Etkinlik kartları */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function EventCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-video w-full bg-muted" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-5 w-3/4 rounded bg-muted" />
        <div className="h-3 w-40 rounded bg-muted" />
        <div className="h-3 w-32 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
    </div>
  )
}

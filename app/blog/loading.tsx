/* Blog liste sayfası yüklenirken görünür */
export default function BlogLoading() {
  return (
    <div className="animate-pulse pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-6">

        {/* Başlık iskelet */}
        <div className="mb-16 border-b border-border pb-10">
          <div className="mb-4 h-3 w-14 rounded bg-muted" />
          <div className="mb-3 h-14 w-72 rounded-lg bg-muted sm:h-16 lg:h-20" />
          <div className="h-5 w-96 max-w-full rounded bg-muted" />
        </div>

        {/* Arama + filtre iskelet */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="h-10 flex-1 rounded-lg bg-muted" />
          <div className="flex gap-2">
            {[56, 72, 64, 80].map((w, i) => (
              <div key={i} className="h-8 rounded-full bg-muted" style={{ width: w }} />
            ))}
          </div>
        </div>

        {/* Kart ızgarası */}
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function PostCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[16/10] w-full rounded-lg bg-muted" />
      <div className="h-3 w-24 rounded bg-muted" />
      <div className="h-5 w-4/5 rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-4 w-2/3 rounded bg-muted" />
      <div className="mt-1 h-3 w-20 rounded bg-muted" />
    </div>
  )
}

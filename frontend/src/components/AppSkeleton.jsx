const navWidths = ['w-24', 'w-20', 'w-16', 'w-28', 'w-14']

export default function AppSkeleton() {
  return (
    <div className="flex min-h-screen" aria-busy="true">
      <p role="status" className="sr-only">
        Loading AutoPulse…
      </p>
      <div className="hidden w-60 shrink-0 flex-col gap-5 border-r border-line bg-surface p-5 lg:flex">
        <div className="h-8 w-32 animate-pulse rounded bg-raised" />
        {navWidths.map((width) => (
          <div key={width} className={`h-4 animate-pulse rounded bg-raised ${width}`} />
        ))}
      </div>
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <div className="h-10 w-full max-w-md animate-pulse rounded-md bg-raised" />
        <div className="h-8 w-48 animate-pulse rounded bg-raised" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((card) => (
            <div key={card} className="h-32 animate-pulse rounded-md border border-line bg-surface" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-md border border-line bg-surface" />
      </div>
    </div>
  )
}

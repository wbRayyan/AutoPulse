const statuses = [
  { label: 'Active', className: 'border-success-line bg-success-soft text-success' },
  { label: 'In maintenance', className: 'border-warning-line bg-warning-soft text-warning' },
  { label: 'Critical', className: 'border-danger-line bg-danger-soft text-danger' },
  { label: 'Retired', className: 'border-info-line bg-info-soft text-info' },
]

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md space-y-5 rounded-md border border-line bg-surface p-6">
        <p className="font-mono text-xs tracking-[0.14em] text-accent">DESIGN TOKENS</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AutoPulse</h1>
          <p className="text-fg-muted">Fleet telematics and maintenance platform.</p>
        </div>
        <p className="font-mono text-2xl font-semibold tabular-nums">84,210 km</p>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <span
              key={status.label}
              className={`rounded border px-2 py-0.5 text-xs font-semibold ${status.className}`}
            >
              {status.label}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="h-11 w-full rounded-md bg-accent font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
        >
          Sign in
        </button>
      </section>
    </main>
  )
}

export default App

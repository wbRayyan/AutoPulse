import { Outlet } from 'react-router'
import Logo from '../../components/Logo'

const readouts = [
  { label: 'SPEED', value: '72 km/h', accent: true },
  { label: 'ENGINE', value: '88 °C' },
  { label: 'FUEL', value: '64%' },
]

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <section
        aria-label="About AutoPulse"
        className="relative hidden flex-1 flex-col justify-between overflow-hidden border-r border-line bg-surface p-10 lg:flex"
      >
        <svg
          viewBox="0 0 600 600"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 size-full"
          aria-hidden="true"
        >
          <polygon points="270,200 330,200 600,600 0,600" className="fill-raised" />
          <line x1="270" y1="200" x2="0" y2="600" className="stroke-line-strong" strokeWidth="2" />
          <line x1="330" y1="200" x2="600" y2="600" className="stroke-line-strong" strokeWidth="2" />
          <line x1="300" y1="200" x2="300" y2="600" className="stroke-fg-subtle" strokeWidth="4" strokeDasharray="18 24" />
        </svg>
        <div className="relative">
          <Logo />
        </div>
        <div className="relative max-w-lg space-y-6">
          <div className="space-y-3">
            <p className="text-4xl font-bold leading-tight tracking-tight">Know every vehicle&apos;s health before it breaks down.</p>
            <p className="text-lg text-fg-muted">
              Maintenance schedules, live telemetry and alerts for your whole fleet in one dashboard.
            </p>
          </div>
          <dl className="flex flex-wrap gap-3">
            {readouts.map((readout) => (
              <div key={readout.label} className="min-w-28 rounded-md border border-line bg-canvas px-4 py-3">
                <dt className="font-mono text-xs tracking-[0.12em] text-fg-muted">{readout.label}</dt>
                <dd className={`font-mono text-xl font-semibold ${readout.accent ? 'text-accent' : 'text-fg'}`}>
                  {readout.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <main className="flex flex-1 items-center justify-center px-6 py-12 lg:max-w-xl">
        <div className="w-full max-w-sm space-y-10">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

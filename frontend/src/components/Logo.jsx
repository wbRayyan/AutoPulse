import { Activity } from 'lucide-react'

export default function Logo() {
  return (
    <span className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-lg border border-line-strong bg-canvas">
        <Activity aria-hidden="true" className="size-5 text-accent" strokeWidth={2.25} />
      </span>
      <span className="text-xl font-bold tracking-tight">AutoPulse</span>
    </span>
  )
}

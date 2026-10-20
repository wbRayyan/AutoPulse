import { TriangleAlert } from 'lucide-react'

export default function FormErrorBanner({ message }) {
  return (
    <div role="alert" className="flex gap-3 rounded-md border border-warning-line bg-warning-soft p-4 text-sm">
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" />
      <p>{message}</p>
    </div>
  )
}

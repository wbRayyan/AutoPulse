import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function PlaceholderPage({ title, description, isBrandPage = false }) {
  useDocumentTitle(isBrandPage ? undefined : title)

  return (
    <section className="mx-auto w-full max-w-2xl space-y-3 rounded-md border border-line bg-surface p-6">
      <p className="font-mono text-xs tracking-[0.14em] text-accent">COMING SOON</p>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      <p className="text-fg-muted">{description}</p>
    </section>
  )
}

import { Link } from 'react-router'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md space-y-4 text-center">
        <p className="font-mono text-sm tracking-[0.14em] text-accent">ERROR 404</p>
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="text-fg-muted">The page you are looking for does not exist or has moved.</p>
        <Link
          to="/"
          className="inline-flex h-11 items-center rounded-md bg-accent px-5 font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  )
}

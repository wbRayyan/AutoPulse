import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import AppSkeleton from '../../components/AppSkeleton'
import { UNAUTHORIZED_EVENT } from '../../lib/api'
import { getToken } from '../../lib/token'
import { useMe } from './useMe'

export default function RequireAuth() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const me = useMe()

  // Any request that finds the token revoked or expired sends the user back to sign in.
  useEffect(() => {
    function handleUnauthorized() {
      queryClient.clear()
      navigate('/login', { replace: true })
    }

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)

    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [navigate, queryClient])

  if (!getToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (me.isPending) {
    return <AppSkeleton />
  }

  if (me.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <section role="alert" className="w-full max-w-md space-y-4 rounded-md border border-line bg-surface p-6 text-center">
          <h1 className="text-xl font-bold">Unable to reach AutoPulse</h1>
          <p className="text-fg-muted">Check your connection and try again.</p>
          <button
            type="button"
            onClick={() => me.refetch()}
            className="h-11 rounded-md bg-accent px-5 font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
          >
            Try again
          </button>
        </section>
      </main>
    )
  }

  return <Outlet />
}

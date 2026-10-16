import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router'
import { LoaderCircle, TriangleAlert } from 'lucide-react'
import { z } from 'zod'
import TextField from '../../components/TextField'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { applyValidationErrors, getErrorMessage } from '../../lib/apiErrors'
import { useLogin } from './useLogin'

const loginSchema = z.object({
  email: z.email({ error: 'Enter a valid email address.' }),
  password: z.string().min(1, { error: 'Enter your password.' }),
})

export default function LoginPage() {
  useDocumentTitle()

  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()
  const [formError, setFormError] = useState(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(values) {
    setFormError(null)

    login.mutate(values, {
      onSuccess: () => navigate(location.state?.from?.pathname ?? '/', { replace: true }),
      onError: (error) => {
        if (!applyValidationErrors(error, setError)) {
          setFormError(getErrorMessage(error))
        }
      },
    })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="font-mono text-xs tracking-[0.14em] text-accent">SIGN IN</p>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-fg-muted">Sign in to manage your fleet.</p>
      </div>

      {formError && (
        <div role="alert" className="flex gap-3 rounded-md border border-warning-line bg-warning-soft p-4 text-sm">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" />
          <p>{formError}</p>
        </div>
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <TextField
          id="password"
          label="Password"
          isPassword
          autoComplete="current-password"
          placeholder="Your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <button
          type="submit"
          disabled={login.isPending}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent font-semibold text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-progress disabled:opacity-70"
        >
          {login.isPending && <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />}
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-fg-muted">
        New to AutoPulse?{' '}
        <Link to="/register" className="font-medium text-accent transition-colors hover:text-accent-hover">
          Register your organization
        </Link>
      </p>
    </div>
  )
}

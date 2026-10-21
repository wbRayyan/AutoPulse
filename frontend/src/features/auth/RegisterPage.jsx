import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import FormErrorBanner from '../../components/FormErrorBanner'
import TextField from '../../components/TextField'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { applyValidationErrors, getErrorMessage, getRetryAfterSeconds } from '../../lib/apiErrors'
import { useRegister } from './useRegister'

const fieldsSchema = z.object({
  organization_name: z
    .string()
    .trim()
    .min(1, { error: 'Enter your organization name.' })
    .max(255, { error: 'Use 255 characters or fewer.' }),
  name: z
    .string()
    .trim()
    .min(1, { error: 'Enter your name.' })
    .max(255, { error: 'Use 255 characters or fewer.' }),
  email: z.email({ error: 'Enter a valid email address.' }),
  password: z.string().min(8, { error: 'Use at least 8 characters.' }),
  password_confirmation: z.string().min(1, { error: 'Confirm your password.' }),
})

const passwordFields = fieldsSchema.pick({ password: true, password_confirmation: true })

const registerSchema = fieldsSchema.refine((values) => values.password === values.password_confirmation, {
  error: 'Passwords do not match.',
  path: ['password_confirmation'],
  // Run the match check even when unrelated fields (e.g. organization name) still have errors.
  when: (payload) => passwordFields.safeParse(payload.value).success,
})

export default function RegisterPage() {
  useDocumentTitle()

  const navigate = useNavigate()
  const registration = useRegister()
  const [formError, setFormError] = useState(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organization_name: '',
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  function onSubmit(values) {
    setFormError(null)

    registration.mutate(values, {
      onSuccess: ({ user }) => {
        toast.success('Organization created', {
          description: `Welcome to AutoPulse, ${user.name}.`,
        })
        navigate('/', { replace: true })
      },
      onError: (error) => {
        if (!applyValidationErrors(error, setError)) {
          setFormError({
            message: getErrorMessage(error),
            retryAfterSeconds: getRetryAfterSeconds(error),
          })
        }
      },
    })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="font-mono text-xs tracking-[0.14em] text-accent">CREATE ACCOUNT</p>
        <h1 className="text-3xl font-bold tracking-tight">Register your organization</h1>
        <p className="text-fg-muted">Set up AutoPulse for your fleet. You will be the owner.</p>
      </div>

      {formError && (
        <FormErrorBanner message={formError.message} retryAfterSeconds={formError.retryAfterSeconds} />
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <TextField
          id="organization_name"
          label="Organization name"
          autoComplete="organization"
          placeholder="Wah Logistics"
          error={errors.organization_name?.message}
          {...register('organization_name')}
        />

        <TextField
          id="name"
          label="Your name"
          autoComplete="name"
          placeholder="Full name"
          error={errors.name?.message}
          {...register('name')}
        />

        <TextField
          id="email"
          label="Work email"
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
          autoComplete="new-password"
          placeholder="Create a password"
          hint="At least 8 characters."
          error={errors.password?.message}
          {...register('password')}
        />

        <TextField
          id="password_confirmation"
          label="Confirm password"
          isPassword
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        <button
          type="submit"
          disabled={registration.isPending}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent font-semibold text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-progress disabled:opacity-70"
        >
          {registration.isPending && <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />}
          {registration.isPending ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-fg-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent transition-colors hover:text-accent-hover">
          Sign in
        </Link>
      </p>
    </div>
  )
}

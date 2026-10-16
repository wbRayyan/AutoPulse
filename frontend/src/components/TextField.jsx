import PasswordInput from './PasswordInput'
import { inputClassName } from '../lib/formStyles'

export default function TextField({ id, label, error, hint, isPassword = false, ...inputProps }) {
  const hasError = Boolean(error)
  const messageId = hasError ? `${id}-error` : hint ? `${id}-hint` : undefined

  const fieldProps = {
    id,
    'aria-invalid': hasError ? 'true' : 'false',
    'aria-describedby': messageId,
    ...inputProps,
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {isPassword ? (
        <PasswordInput hasError={hasError} {...fieldProps} />
      ) : (
        <input className={inputClassName(hasError)} {...fieldProps} />
      )}
      {hasError ? (
        <p id={messageId} className="text-sm text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={messageId} className="text-sm text-fg-muted">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

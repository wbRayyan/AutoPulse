// Puts Laravel 422 validation messages under the matching form fields.
// Returns true when the error was a validation error and has been handled.
export function applyValidationErrors(error, setError) {
  const fieldErrors = error.response?.status === 422 ? error.response.data?.errors : null

  if (!fieldErrors) {
    return false
  }

  Object.entries(fieldErrors).forEach(([field, messages], index) => {
    setError(field, { type: 'server', message: messages[0] }, { shouldFocus: index === 0 })
  })

  return true
}

// A short, human message for errors that do not belong to a single field.
export function getErrorMessage(error) {
  if (error.response?.status === 429) {
    return 'Too many attempts. Please wait a minute and try again.'
  }

  if (!error.response) {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return 'You appear to be offline. Check your internet connection and try again.'
    }

    return 'Unable to reach AutoPulse. Check your connection and try again.'
  }

  return 'Something went wrong. Please try again.'
}

// Seconds until a rate-limited request may be retried, from the Retry-After header.
// Returns null when the error is not a 429 or the header is missing or not a number.
export function getRetryAfterSeconds(error) {
  if (error.response?.status !== 429) {
    return null
  }

  const headers = error.response.headers
  const value = headers?.get?.('retry-after') ?? headers?.['retry-after']
  const seconds = Number.parseInt(value, 10)

  return Number.isFinite(seconds) && seconds > 0 ? seconds : null
}

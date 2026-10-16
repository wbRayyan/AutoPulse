// Shared look for text inputs so every form in AutoPulse feels the same.
export function inputClassName(hasError) {
  const border = hasError ? 'border-danger' : 'border-line-strong hover:border-fg-subtle'

  return `h-11 w-full rounded-md border bg-raised px-3.5 text-base text-fg placeholder:text-fg-subtle transition-colors focus:outline-2 focus:outline-offset-1 focus:outline-accent ${border}`
}

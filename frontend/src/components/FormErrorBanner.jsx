import { useEffect, useState } from 'react'
import { TriangleAlert } from 'lucide-react'

function formatSeconds(seconds) {
  return seconds === 1 ? '1 second' : `${seconds} seconds`
}

export default function FormErrorBanner({ message, retryAfterSeconds = null }) {
  const [secondsLeft, setSecondsLeft] = useState(retryAfterSeconds)

  useEffect(() => {
    if (!secondsLeft) {
      return undefined
    }

    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000)

    return () => clearTimeout(timer)
  }, [secondsLeft])

  let visibleText = message
  let announcedText = message

  if (retryAfterSeconds) {
    const waiting = secondsLeft > 0

    visibleText = waiting
      ? `Too many attempts. Try again in ${formatSeconds(secondsLeft)}.`
      : 'You can try again now.'

    // Screen readers hear the first value and the end, not every tick.
    announcedText = waiting
      ? `Too many attempts. Try again in ${formatSeconds(retryAfterSeconds)}.`
      : 'You can try again now.'
  }

  return (
    <div role="alert" className="flex gap-3 rounded-md border border-warning-line bg-warning-soft p-4 text-sm">
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" />
      <p>
        <span aria-hidden="true" className="tabular-nums">
          {visibleText}
        </span>
        <span className="sr-only">{announcedText}</span>
      </p>
    </div>
  )
}

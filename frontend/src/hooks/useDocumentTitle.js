import { useEffect } from 'react'

const APP_NAME = 'AutoPulse'
const DEFAULT_TITLE = `${APP_NAME} | Fleet Telematics`

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : DEFAULT_TITLE
  }, [title])
}

// The API token lives in localStorage (see ADR-004 for the XSS trade-off).
// Keeping every read and write here means the storage strategy can change in one place.
const TOKEN_KEY = 'autopulse-token'

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Storage is unavailable (for example, blocked by browser settings): the session ends on reload.
  }
}

export function clearToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}

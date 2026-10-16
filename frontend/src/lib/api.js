import axios from 'axios'
import { clearToken, getToken } from './token'

const baseURL = import.meta.env.VITE_API_URL

if (!baseURL) {
  throw new Error('VITE_API_URL is not set. Copy frontend/.env.example to frontend/.env.')
}

// Fired when the API rejects the stored token, so the auth layer can send the user to the login page.
export const UNAUTHORIZED_EVENT = 'autopulse:unauthorized'

export const api = axios.create({
  baseURL,
  headers: { Accept: 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      clearToken()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }

    return Promise.reject(error)
  },
)

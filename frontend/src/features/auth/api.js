import { api } from '../../lib/api'

export const meQueryKey = ['auth', 'me']

export async function fetchMe() {
  const response = await api.get('/auth/me')

  return response.data.data
}

export async function login(credentials) {
  const response = await api.post('/auth/login', credentials)

  return response.data.data
}

import { api } from '../../lib/api'

export const meQueryKey = ['auth', 'me']

export async function fetchMe() {
  const response = await api.get('/auth/me')

  return response.data.data
}

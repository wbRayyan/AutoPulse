import { useQuery } from '@tanstack/react-query'
import { getToken } from '../../lib/token'
import { fetchMe, meQueryKey } from './api'

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: fetchMe,
    enabled: Boolean(getToken()),
    staleTime: 5 * 60_000,
  })
}

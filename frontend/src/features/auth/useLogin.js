import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setToken } from '../../lib/token'
import { login, meQueryKey } from './api'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: ({ user, token }) => {
      setToken(token)
      queryClient.setQueryData(meQueryKey, user)
    },
  })
}

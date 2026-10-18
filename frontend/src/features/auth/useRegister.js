import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setToken } from '../../lib/token'
import { meQueryKey, registerOrganization } from './api'

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registerOrganization,
    onSuccess: ({ user, token }) => {
      setToken(token)
      queryClient.setQueryData(meQueryKey, user)
    },
  })
}

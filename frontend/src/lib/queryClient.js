import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        const status = error?.response?.status

        // Client errors (401, 403, 404, 422) will not succeed on a retry.
        if (status && status < 500) {
          return false
        }

        return failureCount < 2
      },
    },
  },
})

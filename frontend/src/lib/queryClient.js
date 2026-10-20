import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // Fail fast while offline so the UI can show an error instead of an endless loading state.
      networkMode: 'always',
      retry: (failureCount, error) => {
        const status = error?.response?.status

        // Client errors (401, 403, 404, 422) will not succeed on a retry.
        if (status && status < 500) {
          return false
        }

        return failureCount < 2
      },
    },
    mutations: {
      // Same as queries. Mutations keep the default of no retries, because
      // repeating a request that changes data (for example a registration) is not safe.
      networkMode: 'always',
    },
  },
})

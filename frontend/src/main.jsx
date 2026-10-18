import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router/dom'
import { Toaster } from 'sonner'
import './index.css'
import { queryClient } from './lib/queryClient'
import { router } from './routes/router'

// Temporary: follows the class set by the pre-paint script. Step 3.11 makes it reactive.
const toastTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        theme={toastTheme}
        closeButton
        toastOptions={{ style: { fontFamily: 'inherit' } }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)

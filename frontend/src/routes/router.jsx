import { createBrowserRouter } from 'react-router'
import PlaceholderPage from '../components/PlaceholderPage'
import GuestOnly from '../features/auth/GuestOnly'
import RequireAuth from '../features/auth/RequireAuth'
import AppLayout from './AppLayout'
import NotFoundPage from './NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <GuestOnly />,
    children: [
      {
        path: '/login',
        element: (
          <main className="flex min-h-screen items-center justify-center p-6">
            <PlaceholderPage title="Sign in" description="The sign-in form arrives in Step 3.10." isBrandPage />
          </main>
        ),
      },
      {
        path: '/register',
        element: (
          <main className="flex min-h-screen items-center justify-center p-6">
            <PlaceholderPage title="Create account" description="Organization registration arrives in Step 3.10." />
          </main>
        ),
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <PlaceholderPage title="Dashboard" description="Fleet availability, maintenance and alerts at a glance (Phase 7)." />,
          },
          {
            path: 'vehicles',
            element: <PlaceholderPage title="Vehicles" description="Fleet registry with status filters (Phase 4)." />,
          },
          {
            path: 'drivers',
            element: <PlaceholderPage title="Drivers" description="Driver profiles, licenses and assignments (Phase 4)." />,
          },
          {
            path: 'maintenance',
            element: <PlaceholderPage title="Maintenance" description="Service schedules and records (Phase 5)." />,
          },
          {
            path: 'alerts',
            element: <PlaceholderPage title="Alerts" description="Telemetry and maintenance alerts (Phase 6)." />,
          },
          {
            path: 'settings/team',
            element: <PlaceholderPage title="Team" description="Invite members and assign roles (later phase)." />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

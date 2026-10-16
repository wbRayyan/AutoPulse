import { Navigate, Outlet } from 'react-router'
import { getToken } from '../../lib/token'

export default function GuestOnly() {
  if (getToken()) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

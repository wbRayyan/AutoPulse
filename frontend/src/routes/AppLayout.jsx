import { NavLink, Outlet } from 'react-router'
import { useMe } from '../features/auth/useMe'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/drivers', label: 'Drivers' },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/settings/team', label: 'Team' },
]

export default function AppLayout() {
  const { data: user } = useMe()

  return (
    <div className="min-h-screen">
      <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-2 border-b border-line bg-surface px-4 py-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-accent-soft text-fg' : 'text-fg-muted hover:bg-raised hover:text-fg'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
        <p className="ml-auto text-sm text-fg-muted">
          {user.name} · <span className="font-mono uppercase">{user.role}</span> · {user.organization?.name}
        </p>
      </nav>
      <main className="p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  )
}

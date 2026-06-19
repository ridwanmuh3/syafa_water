import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { logoutFn, type getCurrentUserFn } from '~/server/auth/auth.functions'
import { Button } from '~/components/ui/button'
import { Icon, type IconName } from '~/components/ui/icon'
import { cn } from '~/lib/cn'

type User = Awaited<ReturnType<typeof getCurrentUserFn>>

const navItems: Array<{
  to: string
  label: string
  group: string
  icon: IconName
}> = [
  { to: '/dashboard', label: 'Dashboard', group: 'Overview', icon: 'dashboard' },
  { to: '/production', label: 'Production', group: 'Operations', icon: 'factory' },
  { to: '/sales', label: 'Sales', group: 'Operations', icon: 'cart' },
  { to: '/inventory', label: 'Inventory', group: 'Operations', icon: 'stock' },
  { to: '/reports', label: 'Reports', group: 'Insights', icon: 'report' },
  { to: '/products', label: 'Products', group: 'Settings', icon: 'package' },
] as const

export function AppShell({ user }: { user: NonNullable<User> }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const logout = useServerFn(logoutFn)

  return (
    <div className="min-h-screen bg-background text-text lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="hidden border-r border-border bg-surface lg:flex lg:flex-col">
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-card bg-brand-600 text-white">
              <Icon className="h-5 w-5" name="droplet" />
            </span>
            <div>
              <p className="text-lg font-bold text-brand-700">Syafa Water</p>
              <p className="text-sm text-muted">Operations</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-6 p-4">
          {['Overview', 'Operations', 'Insights', 'Settings'].map((group) => (
            <div key={group}>
              <p className="px-3 text-xs font-semibold uppercase text-muted">
                {group}
              </p>
              <div className="mt-2 space-y-1">
                {navItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        'flex items-center gap-2 rounded-control px-3 py-2 text-sm font-semibold transition',
                        pathname === item.to
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-muted hover:bg-brand-50 hover:text-brand-700',
                      )}
                    >
                      <Icon name={item.icon} />
                      {item.label}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-control bg-brand-50 text-brand-700">
              <Icon name="user" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">
                {user.displayName}
              </p>
              <p className="text-xs text-muted">{user.role}</p>
            </div>
          </div>
          <Button
            className="mt-3 w-full"
            variant="secondary"
            onClick={async () => {
              await logout()
              window.location.assign('/login')
            }}
          >
            <Icon name="logout" />
            Log out
          </Button>
        </div>
      </aside>
      <main className="min-w-0">
        <header className="sticky top-0 z-10 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-control bg-brand-600 text-white">
                <Icon name="droplet" />
              </span>
              <div>
                <p className="font-bold text-brand-700">Syafa Water</p>
                <p className="text-xs text-muted">{user.displayName}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={async () => {
                await logout()
                window.location.assign('/login')
              }}
            >
              <Icon name="logout" />
              Logout
            </Button>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold',
                  pathname === item.to
                    ? 'bg-brand-600 text-white'
                    : 'bg-brand-50 text-brand-700',
                )}
              >
                <Icon className="h-3.5 w-3.5" name={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-5 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

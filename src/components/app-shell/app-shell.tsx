import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { logoutFn, type getCurrentUserFn } from '~/server/auth/auth.functions'
import { Icon, type IconName } from '~/components/ui/icon'
import { cn } from '~/lib/cn'
import {
  normalizeDashboardSearch,
  normalizeReportSearch,
} from '~/lib/transactions'

type User = Awaited<ReturnType<typeof getCurrentUserFn>>

const defaultTransactionSearch = {
  search: '',
  from: '',
  to: '',
  product: 0,
  sort: 'date',
  direction: 'desc',
  page: 1,
  perPage: 10,
} as const

const defaultInventorySearch = { q: '', status: '' } as const
const defaultProductSearch = { q: '', status: '' } as const

const navigation: Array<
  | { section: string }
  | {
      to: string
      label: string
      icon: IconName
      key: string
      search?: Record<string, unknown>
    }
> = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    key: 'dashboard',
    search: normalizeDashboardSearch({}),
  },
  { section: 'Operasional' },
  {
    to: '/production',
    label: 'Produksi',
    icon: 'factory',
    key: 'production',
    search: defaultTransactionSearch,
  },
  {
    to: '/sales',
    label: 'Penjualan',
    icon: 'cart',
    key: 'sales',
    search: defaultTransactionSearch,
  },
  {
    to: '/inventory',
    label: 'Inventaris',
    icon: 'stock',
    key: 'inventory',
    search: defaultInventorySearch,
  },
  { section: 'Administrasi' },
  {
    to: '/reports',
    label: 'Laporan',
    icon: 'report',
    key: 'reports',
    search: normalizeReportSearch({}),
  },
  {
    to: '/products',
    label: 'Produk',
    icon: 'package',
    key: 'products',
    search: defaultProductSearch,
  },
]

export function AppShell({ user }: { user: NonNullable<User> }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const logout = useServerFn(logoutFn)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className={cn('app-shell', drawerOpen && 'drawer-open')}>
      <aside className="sidebar" id="sidebar" aria-label="Navigasi utama">
        <div className="sidebar-header">
          <Link
            className="brand"
            search={normalizeDashboardSearch({})}
            to="/dashboard"
          >
            <span className="brand-mark" aria-hidden="true">
              S
            </span>
            <span>
              <strong>Syafa Water</strong>
              <small>Operations</small>
            </span>
          </Link>
        </div>
        <button
          className="icon-button sidebar-toggle"
          type="button"
          aria-controls="sidebar"
          aria-expanded={drawerOpen}
          aria-label="Buka navigasi"
          onClick={() => setDrawerOpen((open) => !open)}
        >
          <Icon name={drawerOpen ? 'x' : 'menu'} />
        </button>
        <nav className="sidebar-nav">
          {navigation.map((item) =>
            'section' in item ? (
              <p className="nav-section" key={item.section}>
                {item.section}
              </p>
            ) : (
              <Link
                className={cn(
                  'nav-link',
                  (pathname === item.to || pathname.startsWith(`${item.to}/`)) &&
                    'active',
                )}
                key={item.key}
                search={item.search}
                to={item.to}
                onClick={() => setDrawerOpen(false)}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            ),
          )}
        </nav>
        <div className="sidebar-user">
          <div className="avatar">
            {user.displayName.slice(0, 1).toUpperCase()}
          </div>
          <div className="user-copy">
            <strong>{user.displayName}</strong>
            <small>{user.role}</small>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Keluar"
            title="Keluar"
            onClick={async () => {
              await logout()
              window.location.assign('/login')
            }}
          >
            <Icon name="logout" />
          </button>
        </div>
      </aside>
      <button
        className="sidebar-backdrop"
        type="button"
        aria-label="Tutup navigasi"
        tabIndex={-1}
        onClick={() => setDrawerOpen(false)}
      />
      <div className="app-main">
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

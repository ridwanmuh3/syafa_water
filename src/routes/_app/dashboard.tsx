import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHeader } from '~/components/page-header'
import { KpiCard } from '~/components/ui/kpi-card'
import { StatusBadge } from '~/components/ui/status-badge'
import { Icon } from '~/components/ui/icon'
import { getDashboardOverviewFn } from '~/server/dashboard/dashboard.functions'
import { formatDate } from '~/lib/dates'
import { formatNumber, formatRupiah } from '~/lib/format'

export const Route = createFileRoute('/_app/dashboard')({
  loader: async () => getDashboardOverviewFn(),
  component: DashboardPage,
})

function DashboardPage() {
  const overview = Route.useLoaderData()

  return (
    <>
      <PageHeader
        icon="dashboard"
        title="Dashboard"
        description={`Current month: ${formatDate(overview.period.from)} - ${formatDate(overview.period.to)}`}
        action={
          <Link
            to="/sales"
            search={{
              search: '',
              from: '',
              to: '',
              product: 0,
              sort: 'date',
              direction: 'desc',
              page: 1,
              perPage: 10,
            }}
            className="inline-flex min-h-10 items-center gap-2 rounded-control bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Icon name="plus" />
            Add transaction
          </Link>
        }
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon="wallet"
          label="Revenue"
          tone="success"
          value={formatRupiah(overview.totals.revenue)}
        />
        <KpiCard
          icon="factory"
          label="Production cost"
          tone="warning"
          value={formatRupiah(overview.totals.cost)}
        />
        <KpiCard
          icon="trend"
          label="Gross profit"
          tone="brand"
          value={formatRupiah(overview.totals.profit)}
        />
        <KpiCard
          icon="stock"
          label="Current stock"
          tone="neutral"
          value={formatNumber(overview.totals.stockUnits)}
          helper={`${formatNumber(overview.totals.productionUnits)} produced, ${formatNumber(overview.totals.salesUnits)} sold this month`}
        />
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-card border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-control bg-brand-50 text-brand-700">
                <Icon name="activity" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-text">Recent activity</h2>
                <p className="text-sm text-muted">
                  Latest production and sales rows.
                </p>
              </div>
            </div>
            <Link
              to="/reports"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700"
            >
              Reports
              <Icon className="h-3.5 w-3.5" name="arrowRight" />
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted">
                  <th className="py-3 pr-4 font-semibold">Date</th>
                  <th className="py-3 pr-4 font-semibold">Type</th>
                  <th className="py-3 pr-4 font-semibold">Product</th>
                  <th className="py-3 pr-4 font-semibold">Qty</th>
                  <th className="py-3 pr-4 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {overview.activity.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="border-b border-border/70">
                    <td className="py-3 pr-4 text-muted">{formatDate(item.date)}</td>
                    <td className="py-3 pr-4 font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                          <Icon
                            className="h-3.5 w-3.5"
                            name={item.type === 'sale' ? 'cart' : 'factory'}
                          />
                        </span>
                        {item.type === 'sale' ? 'Sale' : 'Production'}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{item.productName}</td>
                    <td className="py-3 pr-4 tabular-nums">
                      {formatNumber(item.quantity)}
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold tabular-nums">
                      {formatRupiah(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="rounded-card border border-border bg-surface p-5 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-control bg-orange-50 text-warning">
                <Icon name="alert" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-text">Stock alerts</h2>
                <p className="text-sm text-muted">Products at or below minimum stock.</p>
              </div>
            </div>
            <Link
              to="/inventory"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700"
            >
              Inventory
              <Icon className="h-3.5 w-3.5" name="arrowRight" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {overview.alerts.length ? (
              overview.alerts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-control border border-border p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-control bg-background text-muted">
                        <Icon name="package" />
                      </span>
                      <div>
                        <p className="font-semibold text-text">{item.name}</p>
                        <p className="text-sm text-muted">{item.sku}</p>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    {formatNumber(item.available)} {item.unit} available,
                    minimum {formatNumber(item.minimumStock)}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 rounded-control border border-border p-3 text-sm text-muted">
                <Icon name="stock" />
                <p>No stock alerts.</p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </>
  )
}

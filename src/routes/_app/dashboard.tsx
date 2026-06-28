import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { TrendChart } from '~/components/trend-chart'
import { Icon } from '~/components/ui/icon'
import { KpiCard } from '~/components/ui/kpi-card'
import { getDashboardOverviewFn } from '~/server/dashboard/dashboard.functions'
import { formatDate } from '~/lib/dates'
import { formatNumber, formatRupiah } from '~/lib/format'
import {
  dashboardDateRange,
  normalizeDashboardSearch,
  normalizeReportSearch,
  type DashboardPeriod,
} from '~/lib/transactions'

export const Route = createFileRoute('/_app/dashboard')({
  validateSearch: (search) => normalizeDashboardSearch(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => getDashboardOverviewFn({ data: deps }),
  component: DashboardPage,
})

function DashboardPage() {
  const overview = Route.useLoaderData()
  const filters = Route.useSearch()
  const [period, setPeriod] = useState<DashboardPeriod>(filters.period)
  const [from, setFrom] = useState(overview.period.from)
  const [to, setTo] = useState(overview.period.to)

  useEffect(() => {
    setPeriod(filters.period)
    setFrom(overview.period.from)
    setTo(overview.period.to)
  }, [filters.period, overview.period.from, overview.period.to])

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Ringkasan bisnis untuk ${formatDate(overview.period.from)} - ${formatDate(overview.period.to)}.`}
        action={
          <>
            <Link className="button button-secondary" to="/production/new">
              <Icon name="factory" />
              Tambah produksi
            </Link>
            <Link className="button button-primary" to="/sales/new">
              <Icon name="plus" />
              Tambah penjualan
            </Link>
          </>
        }
      />

      <section className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <form className="period-form" method="get">
            <label className="sr-only" htmlFor="period">
              Periode
            </label>
            <select
              id="period"
              name="period"
              value={period}
              onChange={(event) => {
                const nextPeriod = event.target.value as DashboardPeriod
                setPeriod(nextPeriod)

                if (nextPeriod !== 'custom') {
                  const range = dashboardDateRange(nextPeriod)
                  setFrom(range.from)
                  setTo(range.to)
                }
              }}
            >
              <option value="7d">7 hari terakhir</option>
              <option value="30d">30 hari terakhir</option>
              <option value="month">Bulan ini</option>
              <option value="year">Tahun ini</option>
              <option value="custom">Tanggal kustom</option>
            </select>
            <input
              name="from"
              type="date"
              value={from}
              onChange={(event) => {
                setPeriod('custom')
                setFrom(event.target.value)
              }}
            />
            <input
              name="to"
              type="date"
              value={to}
              onChange={(event) => {
                setPeriod('custom')
                setTo(event.target.value)
              }}
            />
            <button className="button button-primary" type="submit">
              Terapkan periode
            </button>
          </form>
        </div>
      </section>

      <section className="kpi-grid">
        <KpiCard
          icon="cart"
          label="Pendapatan"
          tone="brand"
          value={formatRupiah(overview.totals.revenue)}
          helper="Sesuai periode aktif"
        />
        <KpiCard
          icon="factory"
          label="Biaya produksi"
          tone="warning"
          value={formatRupiah(overview.totals.cost)}
          helper="Biaya produksi produk"
        />
        <KpiCard
          icon="report"
          label="Laba kotor"
          tone="success"
          value={formatRupiah(overview.totals.profit)}
          helper="Pendapatan dikurangi biaya"
        />
        <KpiCard
          icon="stock"
          label="Stok saat ini"
          tone="neutral"
          value={formatNumber(overview.totals.stockUnits)}
          helper={`${overview.alerts.length} produk memerlukan perhatian`}
        />
      </section>

      <section className="dashboard-layout">
        <div className="dashboard-stack dashboard-main">
          <article className="card">
            <div className="card-header">
              <div>
                <h2>Pendapatan vs biaya</h2>
                <p>Bulan berjalan</p>
              </div>
              <div className="chart-legend">
                <span>
                  <i className="legend-dot" />
                  Pendapatan
                </span>
                <span>
                  <i className="legend-dot cost" />
                  Biaya
                </span>
              </div>
            </div>
            <div className="card-body">
              <TrendChart points={overview.trend} />
            </div>
          </article>

          <article className="card">
            <div className="card-header">
              <div>
                <h2>Aktivitas terbaru</h2>
                <p>Produksi dan penjualan terakhir</p>
              </div>
            </div>
            <div className="card-body activity-list">
              {overview.activity.length ? (
                overview.activity.map((activity) => (
                  <div
                    className="activity-item"
                    key={`${activity.type}-${activity.id}`}
                  >
                    <span className="kpi-icon">
                      <Icon name={activity.type === 'sale' ? 'cart' : 'factory'} />
                    </span>
                    <div>
                      <strong>{activity.productName}</strong>
                      <small>
                        {activity.type === 'sale' ? 'Penjualan' : 'Produksi'} ·{' '}
                        {formatDate(activity.date)} ·{' '}
                        {formatNumber(activity.quantity)} unit
                      </small>
                    </div>
                    <strong>{formatRupiah(activity.total)}</strong>
                  </div>
                ))
              ) : (
                <div className="empty">
                  <Icon name="activity" />
                  <h3>Belum ada aktivitas</h3>
                  <p>Transaksi baru akan tampil di sini.</p>
                </div>
              )}
            </div>
          </article>
        </div>

        <aside className="dashboard-stack">
          <article className="card">
            <div className="card-header">
              <div>
                <h2>Peringatan stok</h2>
                <p>Produk rendah atau habis</p>
              </div>
              <Link
                className="button button-ghost button-small"
                search={{ q: '', status: '' }}
                to="/inventory"
              >
                Lihat semua
              </Link>
            </div>
            <div className="card-body alert-list">
              {overview.alerts.length ? (
                overview.alerts.map((item) => (
                  <div className="alert-item" key={item.id}>
                    <span className="kpi-icon">
                      <Icon name="alert" />
                    </span>
                    <div>
                      <strong>{item.name}</strong>
                      <small>
                        {formatNumber(item.available)} {item.unit} tersedia ·
                        minimum {formatNumber(item.minimumStock)}
                      </small>
                    </div>
                    <span className={`badge badge-${item.status}`}>
                      {item.status === 'out' ? 'Habis' : 'Rendah'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty">
                  <Icon name="check" />
                  <h3>Stok terkendali</h3>
                  <p>Semua produk di atas batas minimum.</p>
                </div>
              )}
            </div>
          </article>

          <article className="card">
            <div className="card-header">
              <div>
                <h2>Aksi cepat</h2>
                <p>Pekerjaan umum</p>
              </div>
            </div>
            <div className="card-body quick-actions">
              <QuickAction
                to="/production/new"
                icon="factory"
                title="Catat produksi"
                description="Tambah stok produk jadi"
              />
              <QuickAction
                to="/sales/new"
                icon="cart"
                title="Catat penjualan"
                description="Validasi stok otomatis"
              />
              <QuickAction
                to="/reports"
                search={normalizeReportSearch({})}
                icon="report"
                title="Buka laporan"
                description="Filter, ekspor, dan cetak"
              />
            </div>
          </article>
        </aside>
      </section>
    </>
  )
}

function QuickAction({
  to,
  search,
  icon,
  title,
  description,
}: {
  to: string
  search?: Record<string, unknown>
  icon: 'factory' | 'cart' | 'report'
  title: string
  description: string
}) {
  return (
    <Link className="quick-action" search={search} to={to}>
      <span className="kpi-icon">
        <Icon name={icon} />
      </span>
      <div>
        <strong>{title}</strong>
        <small>{description}</small>
      </div>
      <Icon name="arrowRight" />
    </Link>
  )
}

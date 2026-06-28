import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHeader } from '~/components/page-header'
import { TrendChart } from '~/components/trend-chart'
import { Icon } from '~/components/ui/icon'
import { KpiCard } from '~/components/ui/kpi-card'
import { getReportsOverviewFn } from '~/server/dashboard/dashboard.functions'
import { formatDate } from '~/lib/dates'
import { formatNumber, formatRupiah } from '~/lib/format'
import {
  normalizeReportSearch,
  type ReportFilters,
  type ReportTab,
} from '~/lib/transactions'

export const Route = createFileRoute('/_app/reports/')({
  validateSearch: (search) => normalizeReportSearch(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => getReportsOverviewFn({ data: deps }),
  component: ReportsPage,
})

function ReportsPage() {
  const report = Route.useLoaderData()
  const filters = Route.useSearch()
  const tab = filters.tab
  const margin = report.revenue > 0 ? (report.profit / report.revenue) * 100 : 0

  return (
    <>
      <PageHeader
        title="Laporan"
        description={`Analisis ${formatDate(report.period.from)} - ${formatDate(
          report.period.to,
        )}.`}
        action={
          <>
            <button className="button button-secondary" type="button">
              <Icon name="download" />
              Export CSV
            </button>
            <button
              className="button button-primary"
              type="button"
              onClick={() => window.print()}
            >
              <Icon name="print" />
              Cetak
            </button>
          </>
        }
      />

      <section className="card" style={{ marginBottom: 20 }}>
        <form className="filters report-filters" method="get">
          <input name="tab" type="hidden" value={tab} />
          <div className="field">
            <label htmlFor="from">Tanggal mulai</label>
            <input id="from" name="from" type="date" defaultValue={filters.from} />
          </div>
          <div className="field">
            <label htmlFor="to">Tanggal akhir</label>
            <input id="to" name="to" type="date" defaultValue={filters.to} />
          </div>
          <div className="field">
            <label htmlFor="product">Produk</label>
            <select
              id="product"
              name="product"
              defaultValue={filters.product || ''}
            >
              <option value="">Semua produk</option>
              {report.products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          </div>
          <button className="button button-primary" type="submit">
            Terapkan
          </button>
        </form>
      </section>

      <section className="kpi-grid">
        <KpiCard
          icon="cart"
          label="Pendapatan"
          tone="brand"
          value={formatRupiah(report.revenue)}
          helper="Periode aktif"
        />
        <KpiCard
          icon="factory"
          label="Biaya produksi"
          tone="warning"
          value={formatRupiah(report.cost)}
          helper="Periode aktif"
        />
        <KpiCard
          icon="report"
          label="Laba kotor"
          tone="success"
          value={formatRupiah(report.profit)}
          helper="Pendapatan dikurangi biaya"
        />
        <KpiCard
          icon="dashboard"
          label="Margin"
          tone="neutral"
          value={`${formatNumber(Number(margin.toFixed(1)))}%`}
          helper={`${formatNumber(
            report.salesRows.reduce((total, row) => total + row.quantity, 0),
          )} unit terjual`}
        />
      </section>

      <section className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <h2>Tren kinerja</h2>
            <p>6 periode terakhir</p>
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
          <TrendChart points={report.trend} />
        </div>
      </section>

      <section className="card">
        <nav className="reports-tabs" aria-label="Bagian laporan">
          <ReportTabLink
            filters={filters}
            className={tab === 'summary' ? 'active' : ''}
            tab="summary"
          />
          <ReportTabLink
            filters={filters}
            className={tab === 'sales' ? 'active' : ''}
            tab="sales"
          />
          <ReportTabLink
            filters={filters}
            className={tab === 'production' ? 'active' : ''}
            tab="production"
          />
        </nav>
        {tab === 'summary' ? (
          <SummaryTable points={report.trend} />
        ) : (
          <DetailTable
            rows={tab === 'sales' ? report.salesRows : report.productionRows}
          />
        )}
      </section>
    </>
  )
}

function ReportTabLink({
  filters,
  className,
  tab,
}: {
  filters: ReportFilters
  className: string
  tab: ReportTab
}) {
  const labels: Record<ReportTab, string> = {
    summary: 'Ringkasan',
    sales: 'Detail penjualan',
    production: 'Detail produksi',
  }

  return (
    <Link className={className} search={{ ...filters, tab }} to="/reports">
      {labels[tab]}
    </Link>
  )
}

function SummaryTable({
  points,
}: {
  points: Array<{ label: string; revenue: number; cost: number }>
}) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Periode</th>
            <th className="align-right">Pendapatan</th>
            <th className="align-right">Biaya</th>
            <th className="align-right">Laba kotor</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.label}>
              <td data-label="Periode">{point.label}</td>
              <td className="align-right" data-label="Pendapatan">
                {formatRupiah(point.revenue)}
              </td>
              <td className="align-right" data-label="Biaya">
                {formatRupiah(point.cost)}
              </td>
              <td className="align-right" data-label="Laba kotor">
                <strong>{formatRupiah(point.revenue - point.cost)}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DetailTable({
  rows,
}: {
  rows: Array<{
    id: number
    date: string
    productName: string
    quantity: number
    unitPrice: number
    total: number
  }>
}) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tanggal</th>
            <th>Produk</th>
            <th className="align-right">Jumlah</th>
            <th className="align-right">Harga satuan</th>
            <th className="align-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td data-label="ID">#{row.id}</td>
              <td data-label="Tanggal">{formatDate(row.date)}</td>
              <td data-label="Produk">{row.productName}</td>
              <td className="align-right" data-label="Jumlah">
                {formatNumber(row.quantity)}
              </td>
              <td className="align-right" data-label="Harga satuan">
                {formatRupiah(row.unitPrice)}
              </td>
              <td className="align-right" data-label="Total">
                <strong>{formatRupiah(row.total)}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

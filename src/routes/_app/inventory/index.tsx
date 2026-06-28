import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHeader } from '~/components/page-header'
import { Icon } from '~/components/ui/icon'
import { KpiCard } from '~/components/ui/kpi-card'
import { getInventorySnapshotFn } from '~/server/dashboard/dashboard.functions'
import { formatNumber, formatRupiah } from '~/lib/format'

const inventoryStatuses = ['', 'healthy', 'low', 'out'] as const
type InventoryStatus = (typeof inventoryStatuses)[number]

export const Route = createFileRoute('/_app/inventory/')({
  validateSearch: (search) => normalizeInventorySearch(search),
  loader: async () => getInventorySnapshotFn(),
  component: InventoryPage,
})

function InventoryPage() {
  const snapshot = Route.useLoaderData()
  const filters = Route.useSearch()
  const items = snapshot.items.filter((item) => {
    const term = filters.q.toLowerCase()
    const status = inventoryStatus(item.available, item.minimumStock)
    const matchesSearch =
      !term ||
      item.name.toLowerCase().includes(term) ||
      item.sku.toLowerCase().includes(term)

    return matchesSearch && (!filters.status || status === filters.status)
  })
  const lowCount = snapshot.items.filter(
    (item) => item.available > 0 && item.available <= item.minimumStock,
  ).length
  const outCount = snapshot.items.filter((item) => item.available <= 0).length
  const inventoryValue = snapshot.items.reduce(
    (total, item) => total + item.available * item.productionPrice,
    0,
  )

  return (
    <>
      <PageHeader
        title="Inventaris"
        description="Stok dihitung dari produksi, penjualan, dan penyesuaian."
        action={
          <>
            <Link
              className="button button-secondary"
              search={{ q: '', status: '' }}
              to="/products"
            >
              <Icon name="package" />
              Kelola produk
            </Link>
            <button className="button button-primary" type="button">
              <Icon name="plus" />
              Sesuaikan stok
            </button>
          </>
        }
      />

      <section className="kpi-grid inventory-summary">
        <KpiCard
          icon="stock"
          label="Total unit"
          tone="brand"
          value={formatNumber(snapshot.totalStock)}
          helper="Stok tersedia saat ini"
        />
        <KpiCard
          icon="alert"
          label="Stok rendah"
          tone="warning"
          value={formatNumber(lowCount)}
          helper="Di bawah batas minimum"
        />
        <KpiCard
          icon="alert"
          label="Stok habis"
          tone="danger"
          value={formatNumber(outCount)}
          helper="Perlu produksi segera"
        />
        <KpiCard
          icon="report"
          label="Nilai inventaris"
          tone="success"
          value={formatRupiah(inventoryValue)}
          helper="Berdasarkan biaya produksi"
        />
      </section>

      <section className="card">
        <form
          className="filters"
          method="get"
          style={{ gridTemplateColumns: 'minmax(220px, 1fr) minmax(160px, .5fr) auto' }}
        >
          <div className="search-field">
            <Icon name="search" />
            <label className="sr-only" htmlFor="q">
              Cari produk atau SKU
            </label>
            <input
              id="q"
              name="q"
              type="search"
              placeholder="Cari produk atau SKU"
              defaultValue={filters.q}
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="status">
              Status stok
            </label>
            <select id="status" name="status" defaultValue={filters.status}>
              <option value="">Semua status</option>
              <option value="healthy">Sehat</option>
              <option value="low">Rendah</option>
              <option value="out">Habis</option>
            </select>
          </div>
          <button className="button button-primary" type="submit">
            Terapkan
          </button>
        </form>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th className="align-right">Diproduksi</th>
                <th className="align-right">Terjual</th>
                <th className="align-right">Penyesuaian</th>
                <th className="align-right">Tersedia</th>
                <th className="align-right">Minimum</th>
                <th>Status</th>
                <th className="align-right">Biaya</th>
                <th className="align-right">Harga jual</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const status = inventoryStatus(item.available, item.minimumStock)

                return (
                  <tr key={item.id}>
                    <td data-label="Produk">
                      <strong>{item.name}</strong>
                      <br />
                      <small className="muted">
                        {item.sku} · {item.unit}
                        {!item.active ? ' · Nonaktif' : ''}
                      </small>
                    </td>
                    <td className="align-right" data-label="Diproduksi">
                      {formatNumber(item.produced)}
                    </td>
                    <td className="align-right" data-label="Terjual">
                      {formatNumber(item.sold)}
                    </td>
                    <td className="align-right" data-label="Penyesuaian">
                      {formatNumber(item.adjustment)}
                    </td>
                    <td className="align-right" data-label="Tersedia">
                      <strong>{formatNumber(item.available)}</strong>
                    </td>
                    <td className="align-right" data-label="Minimum">
                      {formatNumber(item.minimumStock)}
                    </td>
                    <td data-label="Status">
                      <span className={`badge badge-${status}`}>
                        {status === 'healthy'
                          ? 'Sehat'
                          : status === 'low'
                            ? 'Rendah'
                            : 'Habis'}
                      </span>
                    </td>
                    <td className="align-right" data-label="Biaya">
                      {formatRupiah(item.productionPrice)}
                    </td>
                    <td className="align-right" data-label="Harga jual">
                      {formatRupiah(item.salePrice)}
                    </td>
                  </tr>
                )
              })}
              {!items.length ? (
                <tr>
                  <td colSpan={9}>
                    <div className="empty">
                      <Icon name="search" />
                      <h3>Data tidak ditemukan</h3>
                      <p>Ubah kata kunci atau status stok.</p>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function inventoryStatus(available: number, minimum: number): InventoryStatus {
  if (available <= 0) return 'out'
  if (available <= minimum) return 'low'
  return 'healthy'
}

function normalizeInventorySearch(search: Record<string, unknown>) {
  const status = inventoryStatuses.includes(search.status as InventoryStatus)
    ? (search.status as InventoryStatus)
    : ''

  return {
    q: typeof search.q === 'string' ? search.q.trim() : '',
    status,
  }
}

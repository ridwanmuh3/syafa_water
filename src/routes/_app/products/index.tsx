import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '~/components/page-header'
import { Icon } from '~/components/ui/icon'
import { getProductCatalogFn } from '~/server/dashboard/dashboard.functions'
import { formatNumber, formatRupiah } from '~/lib/format'

const productStatuses = ['', 'active', 'inactive'] as const
type ProductStatus = (typeof productStatuses)[number]

export const Route = createFileRoute('/_app/products/')({
  validateSearch: (search) => normalizeProductSearch(search),
  loader: async () => getProductCatalogFn(),
  component: ProductsPage,
})

function ProductsPage() {
  const products = Route.useLoaderData()
  const filters = Route.useSearch()
  const filteredProducts = products.filter((product) => {
    const term = filters.q.toLowerCase()
    const status = product.active ? 'active' : 'inactive'
    const matchesSearch =
      !term ||
      product.name.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term)

    return matchesSearch && (!filters.status || status === filters.status)
  })

  return (
    <>
      <PageHeader
        title="Produk"
        description="Kelola SKU, harga, unit, batas minimum, dan status produk."
        action={
          <button className="button button-primary" type="button">
            <Icon name="plus" />
            Tambah produk
          </button>
        }
      />
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
              Status produk
            </label>
            <select id="status" name="status" defaultValue={filters.status}>
              <option value="">Semua status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
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
                <th>SKU</th>
                <th>Nama</th>
                <th>Unit</th>
                <th className="align-right">Biaya produksi</th>
                <th className="align-right">Harga jual</th>
                <th className="align-right">Minimum stok</th>
                <th>Status</th>
                <th className="align-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td data-label="SKU">
                    <strong>{product.sku}</strong>
                  </td>
                  <td data-label="Nama">{product.name}</td>
                  <td data-label="Unit">{product.unit}</td>
                  <td className="align-right" data-label="Biaya produksi">
                    {formatRupiah(product.productionPrice)}
                  </td>
                  <td className="align-right" data-label="Harga jual">
                    {formatRupiah(product.salePrice)}
                  </td>
                  <td className="align-right" data-label="Minimum stok">
                    {formatNumber(product.minimumStock)}
                  </td>
                  <td data-label="Status">
                    <span
                      className={`badge badge-${product.active ? 'active' : 'inactive'}`}
                    >
                      {product.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td data-label="Aksi">
                    <div className="row-actions">
                      <button
                        className="button button-secondary button-small"
                        type="button"
                      >
                        <Icon name="edit" />
                        Edit
                      </button>
                      <button
                        className={`button button-ghost button-small ${
                          product.active ? 'text-danger' : 'text-success'
                        }`}
                        type="button"
                      >
                        {product.active ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredProducts.length ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty">
                      <Icon name="search" />
                      <h3>Data tidak ditemukan</h3>
                      <p>Ubah kata kunci atau status produk.</p>
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

function normalizeProductSearch(search: Record<string, unknown>) {
  const status = productStatuses.includes(search.status as ProductStatus)
    ? (search.status as ProductStatus)
    : ''

  return {
    q: typeof search.q === 'string' ? search.q.trim() : '',
    status,
  }
}

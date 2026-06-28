import { Link, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { Icon } from '~/components/ui/icon'
import { KpiCard } from '~/components/ui/kpi-card'
import { formatDate } from '~/lib/dates'
import { formatNumber, formatRupiah } from '~/lib/format'
import {
  transactionHref,
  transactionPageSizes,
  type TransactionFilters,
  type TransactionListResult,
  type TransactionSort,
  type TransactionType,
} from '~/lib/transactions'
import { deleteTransactionFn } from '~/server/transactions/transactions.functions'

const copy = {
  production: {
    title: 'Produksi',
    description: 'Pantau transaksi produksi dan biaya produk.',
    addLabel: 'Tambah produksi',
    valueLabel: 'Biaya produksi',
    unitsLabel: 'Unit diproduksi',
    priceLabel: 'Biaya satuan',
    empty: 'Belum ada produksi',
  },
  sales: {
    title: 'Penjualan',
    description: 'Pantau transaksi penjualan dan pendapatan.',
    addLabel: 'Tambah penjualan',
    valueLabel: 'Nilai penjualan',
    unitsLabel: 'Unit terjual',
    priceLabel: 'Harga satuan',
    empty: 'Belum ada transaksi',
  },
}

export function TransactionListPage({
  type,
  filters,
  data,
}: {
  type: TransactionType
  filters: TransactionFilters
  data: TransactionListResult
}) {
  const router = useRouter()
  const deleteTransaction = useServerFn(deleteTransactionFn)
  const [deleteTarget, setDeleteTarget] = useState<
    TransactionListResult['rows'][number] | null
  >(null)
  const [deleting, setDeleting] = useState(false)
  const pageCopy = copy[type]
  const basePath = type === 'production' ? '/production' : '/sales'
  const newPath = type === 'production' ? '/production/new' : '/sales/new'

  return (
    <>
      <PageHeader
        title={pageCopy.title}
        description={pageCopy.description}
        action={
          <Link className="button button-primary" to={newPath}>
            <Icon name="plus" />
            {pageCopy.addLabel}
          </Link>
        }
      />

      <section className="kpi-grid">
        <KpiCard
          icon={type === 'sales' ? 'cart' : 'factory'}
          label={pageCopy.valueLabel}
          tone={type === 'sales' ? 'brand' : 'warning'}
          value={formatRupiah(data.metrics.valueTotal)}
          helper="Sesuai filter aktif"
        />
        <KpiCard
          icon="stock"
          label={pageCopy.unitsLabel}
          tone="success"
          value={formatNumber(data.metrics.units)}
          helper="Total volume transaksi"
        />
        <KpiCard
          icon="report"
          label="Rata-rata transaksi"
          tone="warning"
          value={formatRupiah(data.metrics.averageTotal)}
          helper="Nilai per transaksi"
        />
      </section>

      <section className="card">
        <form className="filters transaction-filters" method="get">
          <div className="search-field">
            <Icon name="search" />
            <label className="sr-only" htmlFor="q">
              Cari produk atau ID transaksi
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={filters.search}
              placeholder="Cari produk atau ID"
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="from">
              Tanggal mulai
            </label>
            <input
              id="from"
              name="from"
              type="date"
              defaultValue={filters.from}
              title="Tanggal mulai"
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="to">
              Tanggal akhir
            </label>
            <input
              id="to"
              name="to"
              type="date"
              defaultValue={filters.to}
              title="Tanggal akhir"
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="product">
              Produk
            </label>
            <select
              id="product"
              name="product"
              defaultValue={filters.product || ''}
            >
              <option value="">Semua produk</option>
              {data.products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <input type="hidden" name="sort" value={filters.sort} />
          <input type="hidden" name="direction" value={filters.direction} />
          <input type="hidden" name="per_page" value={filters.perPage} />
          <div className="filter-actions">
            <button className="button button-primary" type="submit">
              Terapkan
            </button>
            <a
              className="button button-secondary"
              href={transactionHref(basePath, filters, { page: 1 })}
            >
              <Icon name="download" />
              Export CSV
            </a>
          </div>
        </form>

        {!data.rows.length ? (
          <div className="empty">
            <Icon name={type === 'sales' ? 'cart' : 'factory'} />
            <h3>{pageCopy.empty}</h3>
            <p>Ubah filter atau catat transaksi baru.</p>
            <Link className="button button-primary" to={newPath}>
              <Icon name="plus" />
              {pageCopy.addLabel}
            </Link>
          </div>
        ) : (
          <>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <SortableHeader
                      basePath={basePath}
                      filters={filters}
                      label="ID"
                      sort="id"
                    />
                    <SortableHeader
                      basePath={basePath}
                      filters={filters}
                      label="Tanggal"
                      sort="date"
                    />
                    <SortableHeader
                      basePath={basePath}
                      filters={filters}
                      label="Produk"
                      sort="product"
                    />
                    <SortableHeader
                      align="right"
                      basePath={basePath}
                      filters={filters}
                      label="Jumlah"
                      sort="quantity"
                    />
                    <SortableHeader
                      align="right"
                      basePath={basePath}
                      filters={filters}
                      label={pageCopy.priceLabel}
                      sort="price"
                    />
                    <SortableHeader
                      align="right"
                      basePath={basePath}
                      filters={filters}
                      label="Total"
                      sort="total"
                    />
                    <th className="align-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row) => (
                    <tr key={row.id}>
                      <td data-label="ID">#{row.id}</td>
                      <td data-label="Tanggal">{formatDate(row.date)}</td>
                      <td data-label="Produk">
                        <strong>{row.productName}</strong>
                        {row.note ? (
                          <>
                            <br />
                            <small className="muted">{row.note}</small>
                          </>
                        ) : null}
                      </td>
                      <td className="align-right" data-label="Jumlah">
                        {formatNumber(row.quantity)}
                      </td>
                      <td className="align-right" data-label={pageCopy.priceLabel}>
                        {formatRupiah(row.unitPrice)}
                      </td>
                      <td className="align-right" data-label="Total">
                        <strong>{formatRupiah(row.total)}</strong>
                      </td>
                      <td data-label="Aksi">
                        <div className="row-actions">
                          <Link
                            className="button button-secondary button-small"
                            params={{ id: String(row.id) }}
                            to={
                              type === 'production'
                                ? '/production/$id/edit'
                                : '/sales/$id/edit'
                            }
                          >
                            <Icon name="edit" />
                            Edit
                          </Link>
                          <button
                            className="button button-ghost button-small text-danger"
                            type="button"
                            onClick={() => setDeleteTarget(row)}
                          >
                            <Icon name="trash" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>
                Menampilkan {formatNumber(data.fromRow)}-
                {formatNumber(data.toRow)} dari {formatNumber(data.total)}{' '}
                transaksi
              </span>
              <div className="pagination-controls">
                <select
                  aria-label="Baris per halaman"
                  defaultValue={filters.perPage}
                  onChange={(event) => {
                    window.location.href = transactionHref(basePath, filters, {
                      page: 1,
                      perPage: Number(event.target.value) as typeof filters.perPage,
                    })
                  }}
                >
                  {transactionPageSizes.map((size) => (
                    <option key={size} value={size}>
                      {size} baris
                    </option>
                  ))}
                </select>
                <a
                  className={`page-link ${data.page <= 1 ? 'disabled' : ''}`}
                  href={transactionHref(basePath, filters, {
                    page: Math.max(1, data.page - 1),
                  })}
                  aria-label="Halaman sebelumnya"
                >
                  &lsaquo;
                </a>
                {paginationPages(data.page, data.pages).map((page) => (
                  <a
                    className={`page-link ${page === data.page ? 'active' : ''}`}
                    href={transactionHref(basePath, filters, { page })}
                    key={page}
                  >
                    {formatNumber(page)}
                  </a>
                ))}
                <a
                  className={`page-link ${data.page >= data.pages ? 'disabled' : ''}`}
                  href={transactionHref(basePath, filters, {
                    page: Math.min(data.pages, data.page + 1),
                  })}
                  aria-label="Halaman berikutnya"
                >
                  &rsaquo;
                </a>
              </div>
            </div>
          </>
        )}
      </section>

      {deleteTarget ? (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <div className="modal-header">
              <h2>Hapus transaksi?</h2>
              <button
                className="icon-button"
                type="button"
                aria-label="Tutup"
                onClick={() => setDeleteTarget(null)}
              >
                <Icon name="x" />
              </button>
            </div>
            <div className="modal-body">
              <p>
                #{deleteTarget.id} - {deleteTarget.productName},{' '}
                {formatNumber(deleteTarget.quantity)} unit,{' '}
                {formatRupiah(deleteTarget.total)}
              </p>
              <p className="muted">
                Stok dan laporan akan dihitung ulang setelah transaksi dihapus.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </button>
              <button
                className="button button-danger"
                type="button"
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true)
                  await deleteTransaction({
                    data: { type, id: deleteTarget.id },
                  })
                  setDeleting(false)
                  setDeleteTarget(null)
                  await router.invalidate()
                }}
              >
                {deleting ? 'Menghapus...' : 'Hapus transaksi'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function SortableHeader({
  label,
  sort,
  basePath,
  filters,
  align = 'left',
}: {
  label: string
  sort: TransactionSort
  basePath: string
  filters: TransactionFilters
  align?: 'left' | 'right'
}) {
  const active = filters.sort === sort
  const direction = active && filters.direction === 'asc' ? 'desc' : 'asc'

  return (
    <th className={align === 'right' ? 'align-right' : ''}>
      <a
        className={`sort-link ${active ? 'active' : ''}`}
        href={transactionHref(basePath, filters, { sort, direction, page: 1 })}
      >
        {label}
        {active ? <Icon name="chevrons" /> : null}
      </a>
    </th>
  )
}

function paginationPages(page: number, pages: number) {
  const start = Math.max(1, page - 1)
  const end = Math.min(pages, page + 1)
  const result: Array<number> = []

  for (let current = start; current <= end; current++) {
    result.push(current)
  }

  return result
}

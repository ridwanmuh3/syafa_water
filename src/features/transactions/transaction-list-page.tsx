import { Link } from '@tanstack/react-router'
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

type TransactionCopy = {
  title: string
  description: string
  addLabel: string
  valueLabel: string
  averageLabel: string
  priceLabel: string
}

const copy: Record<TransactionType, TransactionCopy> = {
  production: {
    title: 'Production',
    description: 'Track production batches, costs, and product output.',
    addLabel: 'Add production',
    valueLabel: 'Production cost',
    averageLabel: 'Average batch',
    priceLabel: 'Unit cost',
  },
  sales: {
    title: 'Sales',
    description: 'Track product sales, units sold, and revenue.',
    addLabel: 'Add sale',
    valueLabel: 'Revenue',
    averageLabel: 'Average transaction',
    priceLabel: 'Unit price',
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
  const pageCopy = copy[type]
  const basePath = type === 'production' ? '/production' : '/sales'
  const newPath = type === 'production' ? '/production/new' : '/sales/new'
  const pageIcon = type === 'production' ? 'factory' : 'cart'

  return (
    <>
      <PageHeader
        icon={pageIcon}
        title={pageCopy.title}
        description={pageCopy.description}
        action={
          <Link
            to={newPath}
            className="inline-flex min-h-10 items-center gap-2 rounded-control bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Icon name="plus" />
            {pageCopy.addLabel}
          </Link>
        }
      />
      <section className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          icon={type === 'production' ? 'factory' : 'wallet'}
          label={pageCopy.valueLabel}
          tone={type === 'production' ? 'warning' : 'success'}
          value={formatRupiah(data.metrics.valueTotal)}
          helper={`${formatNumber(data.total)} matching rows`}
        />
        <KpiCard
          icon="stock"
          label="Units"
          tone="neutral"
          value={formatNumber(data.metrics.units)}
        />
        <KpiCard
          icon="trend"
          label={pageCopy.averageLabel}
          value={formatRupiah(data.metrics.averageTotal)}
        />
      </section>
      <section className="mt-6 rounded-card border border-border bg-surface p-4 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-control bg-brand-50 text-brand-700">
            <Icon name="filter" />
          </span>
          <div>
            <h2 className="font-semibold text-text">Filters</h2>
            <p className="text-sm text-muted">Search demo rows by product, date, and item.</p>
          </div>
        </div>
        <form className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <label className="block">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-text">
              <Icon className="h-3.5 w-3.5 text-muted" name="search" />
              Search
            </span>
            <input
              className="mt-1 min-h-10 w-full rounded-control border border-border bg-surface px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              name="q"
              type="search"
              defaultValue={filters.search}
              placeholder="Product or ID"
            />
          </label>
          <label className="block">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-text">
              <Icon className="h-3.5 w-3.5 text-muted" name="calendar" />
              From
            </span>
            <input
              className="mt-1 min-h-10 w-full rounded-control border border-border bg-surface px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              name="from"
              type="date"
              defaultValue={filters.from}
            />
          </label>
          <label className="block">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-text">
              <Icon className="h-3.5 w-3.5 text-muted" name="calendar" />
              To
            </span>
            <input
              className="mt-1 min-h-10 w-full rounded-control border border-border bg-surface px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              name="to"
              type="date"
              defaultValue={filters.to}
            />
          </label>
          <label className="block">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-text">
              <Icon className="h-3.5 w-3.5 text-muted" name="package" />
              Product
            </span>
            <select
              className="mt-1 min-h-10 w-full rounded-control border border-border bg-surface px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              name="product"
              defaultValue={filters.product || ''}
            >
              <option value="">All products</option>
              {data.products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end gap-2">
            <input type="hidden" name="sort" value={filters.sort} />
            <input type="hidden" name="direction" value={filters.direction} />
            <input type="hidden" name="per_page" value={filters.perPage} />
            <button
              className="inline-flex min-h-10 items-center gap-2 rounded-control bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
              type="submit"
            >
              <Icon name="search" />
              Apply
            </button>
            <a
              className="inline-flex min-h-10 items-center gap-2 rounded-control border border-border px-4 text-sm font-semibold text-muted hover:text-brand-700"
              href={basePath}
            >
              <Icon name="reset" />
              Reset
            </a>
          </div>
        </form>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted">
                <SortableHeader label="Date" sort="date" basePath={basePath} filters={filters} />
                <SortableHeader label="Product" sort="product" basePath={basePath} filters={filters} />
                <SortableHeader label="Qty" sort="quantity" basePath={basePath} filters={filters} />
                <SortableHeader label={pageCopy.priceLabel} sort="price" basePath={basePath} filters={filters} />
                <SortableHeader label="Total" sort="total" basePath={basePath} filters={filters} align="right" />
                <th className="py-3 pl-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.length ? (
                data.rows.map((row) => (
                  <tr key={row.id} className="border-b border-border/70">
                    <td className="py-3 pr-4 text-muted">{formatDate(row.date)}</td>
                    <td className="py-3 pr-4 font-semibold text-text">
                      <span className="inline-flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                          <Icon className="h-3.5 w-3.5" name="package" />
                        </span>
                        {row.productName}
                      </span>
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      {formatNumber(row.quantity)}
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      {formatRupiah(row.unitPrice)}
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold tabular-nums">
                      {formatRupiah(row.total)}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <Link
                        to={
                          type === 'production'
                            ? '/production/$id/edit'
                            : '/sales/$id/edit'
                        }
                        params={{ id: String(row.id) }}
                        className="inline-flex items-center gap-1.5 font-semibold text-brand-700"
                      >
                        <Icon className="h-3.5 w-3.5" name="edit" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-8 text-center text-muted" colSpan={6}>
                    <div className="flex flex-col items-center gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-control bg-background text-muted">
                        <Icon name="search" />
                      </span>
                      <span>No transactions match current filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Showing {formatNumber(data.fromRow)}-{formatNumber(data.toRow)} of{' '}
            {formatNumber(data.total)}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Rows</span>
            {transactionPageSizes.map((size) => (
              <a
                key={size}
                className={
                  size === filters.perPage
                    ? 'rounded-control bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white'
                    : 'rounded-control border border-border px-3 py-1.5 text-sm font-semibold text-muted hover:text-brand-700'
                }
                href={transactionHref(basePath, filters, { page: 1, perPage: size })}
              >
                {size}
              </a>
            ))}
            <a
              className="inline-flex items-center gap-1.5 rounded-control border border-border px-3 py-1.5 text-sm font-semibold text-muted hover:text-brand-700 aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={data.page <= 1}
              href={transactionHref(basePath, filters, {
                page: Math.max(1, data.page - 1),
              })}
            >
              <Icon className="h-3.5 w-3.5" name="arrowLeft" />
              Prev
            </a>
            <span className="px-2 text-sm text-muted">
              {formatNumber(data.page)} / {formatNumber(data.pages)}
            </span>
            <a
              className="inline-flex items-center gap-1.5 rounded-control border border-border px-3 py-1.5 text-sm font-semibold text-muted hover:text-brand-700 aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={data.page >= data.pages}
              href={transactionHref(basePath, filters, {
                page: Math.min(data.pages, data.page + 1),
              })}
            >
              Next
              <Icon className="h-3.5 w-3.5" name="arrowRight" />
            </a>
          </div>
        </div>
      </section>
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
    <th className={`py-3 pr-4 font-semibold ${align === 'right' ? 'text-right' : ''}`}>
      <a
        className="inline-flex items-center gap-1 hover:text-brand-700"
        href={transactionHref(basePath, filters, {
          sort,
          direction,
          page: 1,
        })}
      >
        {label}
        {active ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] text-brand-700">
            <Icon className="h-3 w-3" name="chevrons" />
            {filters.direction === 'asc' ? 'Asc' : 'Desc'}
          </span>
        ) : null}
      </a>
    </th>
  )
}

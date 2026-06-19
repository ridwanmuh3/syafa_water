export const transactionSorts = [
  'date',
  'product',
  'quantity',
  'price',
  'total',
  'id',
] as const

export const transactionDirections = ['asc', 'desc'] as const
export const transactionPageSizes = [10, 25, 50] as const

export type TransactionType = 'production' | 'sales'
export type TransactionSort = (typeof transactionSorts)[number]
export type TransactionDirection = (typeof transactionDirections)[number]
export type TransactionPageSize = (typeof transactionPageSizes)[number]

export type TransactionFilters = {
  search: string
  from: string
  to: string
  product: number
  sort: TransactionSort
  direction: TransactionDirection
  page: number
  perPage: TransactionPageSize
}

export type TransactionRow = {
  id: number
  productId: number
  productName: string
  date: string
  quantity: number
  unitPrice: number
  total: number
  note: string | null
}

export type ProductOption = {
  id: number
  sku: string
  name: string
}

export type TransactionListMetrics = {
  units: number
  valueTotal: number
  averageTotal: number
}

export type TransactionListResult = {
  rows: Array<TransactionRow>
  products: Array<ProductOption>
  metrics: TransactionListMetrics
  total: number
  page: number
  pages: number
  fromRow: number
  toRow: number
}

export function normalizeTransactionSearch(
  input: Record<string, unknown>,
): TransactionFilters {
  const perPage = normalizePageSize(input.perPage ?? input.per_page)

  return {
    search: stringValue(input.search ?? input.q),
    from: dateValue(input.from),
    to: dateValue(input.to),
    product: positiveInteger(input.product, 0),
    sort: sortValue(input.sort),
    direction: directionValue(input.direction),
    page: positiveInteger(input.page, 1),
    perPage,
  }
}

export function transactionHref(
  path: string,
  filters: TransactionFilters,
  patch: Partial<TransactionFilters> = {},
) {
  const next = { ...filters, ...patch }
  const params = new URLSearchParams()

  if (next.search) params.set('q', next.search)
  if (next.from) params.set('from', next.from)
  if (next.to) params.set('to', next.to)
  if (next.product) params.set('product', String(next.product))
  if (next.sort !== 'date') params.set('sort', next.sort)
  if (next.direction !== 'desc') params.set('direction', next.direction)
  if (next.page !== 1) params.set('page', String(next.page))
  if (next.perPage !== 10) params.set('per_page', String(next.perPage))

  const query = params.toString()
  return query ? `${path}?${query}` : path
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function dateValue(value: unknown) {
  if (typeof value !== 'string') {
    return ''
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ''
}

function sortValue(value: unknown): TransactionSort {
  return transactionSorts.includes(value as TransactionSort)
    ? (value as TransactionSort)
    : 'date'
}

function directionValue(value: unknown): TransactionDirection {
  return value === 'asc' ? 'asc' : 'desc'
}

function normalizePageSize(value: unknown): TransactionPageSize {
  const size = positiveInteger(value, 10)
  return transactionPageSizes.includes(size as TransactionPageSize)
    ? (size as TransactionPageSize)
    : 10
}

function positiveInteger(value: unknown, fallback: number) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0) {
    return fallback
  }

  return parsed
}

import { currentMonthRange } from './dates'

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
export const dashboardPeriods = ['7d', '30d', 'month', 'year', 'custom'] as const
export const reportTabs = ['summary', 'sales', 'production'] as const

export type TransactionType = 'production' | 'sales'
export type TransactionSort = (typeof transactionSorts)[number]
export type TransactionDirection = (typeof transactionDirections)[number]
export type TransactionPageSize = (typeof transactionPageSizes)[number]
export type DashboardPeriod = (typeof dashboardPeriods)[number]
export type ReportTab = (typeof reportTabs)[number]

export type DashboardFilters = {
  period: DashboardPeriod
  from: string
  to: string
}

export type ReportFilters = {
  from: string
  to: string
  product: number
  tab: ReportTab
}

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
  unit: string
  minimumStock: number
  productionPrice: number
  salePrice: number
  active: boolean
  available?: number
}

export type TransactionListMetrics = {
  units: number
  valueTotal: number
  averageTotal: number
}

export type TransactionSummary = {
  dayTotal: number
  monthTotal: number
  yearTotal: number
  dayUnits: number
  monthUnits: number
  yearUnits: number
}

export type TransactionListResult = {
  rows: Array<TransactionRow>
  products: Array<ProductOption>
  metrics: TransactionListMetrics
  summary: TransactionSummary
  total: number
  page: number
  pages: number
  fromRow: number
  toRow: number
}

export type TransactionMutationInput = {
  id?: number
  productId: number
  date: string
  quantity: number
  unitPrice?: number
  note?: string
}

export type InventoryItem = ProductOption & {
  produced: number
  sold: number
  adjustment: number
  available: number
  rejected: number
}

export type InventorySnapshot = {
  totalItems: number
  totalStock: number
  rejected: number
  items: Array<InventoryItem>
}

export type MonthlyTrendPoint = {
  label: string
  revenue: number
  cost: number
}

export type ReportOverview = {
  period: {
    from: string
    to: string
  }
  products: Array<ProductOption>
  revenue: number
  cost: number
  profit: number
  salesRows: Array<TransactionRow>
  productionRows: Array<TransactionRow>
  trend: Array<MonthlyTrendPoint>
}

export type ProductCatalogItem = ProductOption & {
  available: number
  rejected: number
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

export function normalizeDashboardSearch(
  input: Record<string, unknown>,
): DashboardFilters {
  const period = dashboardPeriodValue(input.period)

  if (period !== 'custom') {
    return {
      period,
      ...dashboardDateRange(period),
    }
  }

  const fallback = currentMonthRange()
  const from = dateValue(input.from) || fallback.from
  const to = dateValue(input.to) || fallback.to
  const range = orderedRange(from, to)

  return {
    period,
    ...range,
  }
}

export function normalizeReportSearch(
  input: Record<string, unknown>,
): ReportFilters {
  const fallback = currentMonthRange()
  const from = dateValue(input.from) || fallback.from
  const to = dateValue(input.to) || fallback.to

  return {
    ...orderedRange(from, to),
    product: positiveInteger(input.product, 0),
    tab: reportTabValue(input.tab),
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

function dashboardPeriodValue(value: unknown): DashboardPeriod {
  return dashboardPeriods.includes(value as DashboardPeriod)
    ? (value as DashboardPeriod)
    : 'month'
}

function reportTabValue(value: unknown): ReportTab {
  return reportTabs.includes(value as ReportTab) ? (value as ReportTab) : 'summary'
}

function normalizePageSize(value: unknown): TransactionPageSize {
  const size = positiveInteger(value, 10)
  return transactionPageSizes.includes(size as TransactionPageSize)
    ? (size as TransactionPageSize)
    : 10
}

export function dashboardDateRange(period: DashboardPeriod) {
  const today = new Date()

  if (period === '7d') {
    return {
      from: dateInputValue(daysAgo(today, 6)),
      to: dateInputValue(today),
    }
  }

  if (period === '30d') {
    return {
      from: dateInputValue(daysAgo(today, 29)),
      to: dateInputValue(today),
    }
  }

  if (period === 'year') {
    const year = today.getFullYear()

    return {
      from: `${year}-01-01`,
      to: `${year}-12-31`,
    }
  }

  return currentMonthRange(today)
}

function orderedRange(from: string, to: string) {
  return from <= to ? { from, to } : { from: to, to: from }
}

function daysAgo(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() - days)

  return next
}

function dateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function positiveInteger(value: unknown, fallback: number) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0) {
    return fallback
  }

  return parsed
}

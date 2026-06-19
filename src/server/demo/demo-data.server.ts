import type {
  DashboardTotals,
  RecentActivity,
  StockAlert,
} from '../repositories/dashboard.repository.server'
import type { SessionUser } from '../auth/session.server'
import type {
  ProductOption,
  TransactionFilters,
  TransactionListMetrics,
  TransactionRow,
  TransactionSort,
  TransactionType,
} from '~/lib/transactions'
import { currentMonthRange } from '~/lib/dates'

type DemoProduct = ProductOption & {
  unit: string
  minimumStock: number
  active: boolean
}

type DemoTransaction = TransactionRow & {
  type: TransactionType
}

export const demoUser: SessionUser = {
  id: 1,
  username: 'admin',
  displayName: 'Demo Administrator',
  role: 'administrator',
}

const products: Array<DemoProduct> = [
  { id: 1, sku: 'GALON', name: 'Galon', unit: 'galon', minimumStock: 100, active: true },
  { id: 2, sku: 'CUP', name: 'Cup', unit: 'dus', minimumStock: 100, active: true },
  { id: 3, sku: 'BTL-330', name: 'Botol 330 ml', unit: 'dus', minimumStock: 120, active: true },
  { id: 4, sku: 'BTL-600', name: 'Botol 600 ml', unit: 'dus', minimumStock: 100, active: true },
]

const productionRows: Array<DemoTransaction> = [
  production(101, 1, 3, 260, 5_000),
  production(102, 2, 6, 520, 2_000),
  production(103, 3, 9, 660, 3_000),
  production(104, 4, 12, 360, 4_000),
  production(105, 1, 16, 140, 5_000),
  production(106, 3, 18, 220, 3_000),
]

const salesRows: Array<DemoTransaction> = [
  sale(201, 1, 4, 210, 10_000),
  sale(202, 2, 7, 460, 5_000),
  sale(203, 3, 10, 590, 6_000),
  sale(204, 4, 13, 250, 7_000),
  sale(205, 1, 17, 120, 10_000),
  sale(206, 3, 19, 170, 6_000),
]

export function demoProductOptions(): Array<ProductOption> {
  return products.map(({ id, sku, name }) => ({ id, sku, name }))
}

export function demoDashboardTotals(from: string, to: string): DashboardTotals {
  const sales = filterByDate(salesRows, from, to)
  const production = filterByDate(productionRows, from, to)
  const revenue = sum(sales, (row) => row.total)
  const cost = sum(production, (row) => row.total)

  return {
    revenue,
    cost,
    profit: revenue - cost,
    salesUnits: sum(sales, (row) => row.quantity),
    productionUnits: sum(production, (row) => row.quantity),
    stockUnits: sum(products, (product) => availableStock(product.id)),
  }
}

export function demoStockAlerts(limit = 5): Array<StockAlert> {
  return products
    .map((product) => {
      const available = availableStock(product.id)

      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        unit: product.unit,
        available,
        minimumStock: product.minimumStock,
        status: available <= 0 ? ('out' as const) : ('low' as const),
      }
    })
    .filter((product) => product.available <= product.minimumStock)
    .sort((a, b) => a.available - b.available || a.name.localeCompare(b.name))
    .slice(0, limit)
}

export function demoRecentActivity(limit = 6): Array<RecentActivity> {
  return [...productionRows, ...salesRows]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, limit)
    .map((row) => ({
      id: row.id,
      type: row.type === 'sales' ? 'sale' : 'production',
      productName: row.productName,
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      total: row.total,
      date: row.date,
    }))
}

export function demoTransactionRows(
  type: TransactionType,
  filters: TransactionFilters,
): {
  rows: Array<TransactionRow>
  metrics: TransactionListMetrics
  total: number
  page: number
  pages: number
  fromRow: number
  toRow: number
} {
  const source = type === 'production' ? productionRows : salesRows
  const filtered = source
    .filter((row) => matchesFilters(row, filters))
    .sort((a, b) => compareTransactions(a, b, filters.sort, filters.direction))
  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / filters.perPage))
  const page = Math.min(filters.page, pages)
  const offset = (page - 1) * filters.perPage
  const rows = filtered.slice(offset, offset + filters.perPage)

  return {
    rows,
    metrics: {
      units: sum(filtered, (row) => row.quantity),
      valueTotal: sum(filtered, (row) => row.total),
      averageTotal: total ? sum(filtered, (row) => row.total) / total : 0,
    },
    total,
    page,
    pages,
    fromRow: total ? offset + 1 : 0,
    toRow: Math.min(offset + filters.perPage, total),
  }
}

function production(
  id: number,
  productId: number,
  day: number,
  quantity: number,
  unitPrice: number,
): DemoTransaction {
  return transaction('production', id, productId, day, quantity, unitPrice)
}

function sale(
  id: number,
  productId: number,
  day: number,
  quantity: number,
  unitPrice: number,
): DemoTransaction {
  return transaction('sales', id, productId, day, quantity, unitPrice)
}

function transaction(
  type: TransactionType,
  id: number,
  productId: number,
  day: number,
  quantity: number,
  unitPrice: number,
): DemoTransaction {
  const product = products.find((item) => item.id === productId)
  if (!product) {
    throw new Error(`Missing demo product: ${productId}`)
  }

  return {
    id,
    type,
    productId,
    productName: product.name,
    date: dateInCurrentMonth(day),
    quantity,
    unitPrice,
    total: quantity * unitPrice,
    note: null,
  }
}

function dateInCurrentMonth(day: number) {
  const { from, to } = currentMonthRange()
  const lastDay = Number(to.slice(8, 10))
  return `${from.slice(0, 8)}${String(Math.min(day, lastDay)).padStart(2, '0')}`
}

function availableStock(productId: number) {
  return (
    sum(productionRows.filter((row) => row.productId === productId), (row) => row.quantity) -
    sum(salesRows.filter((row) => row.productId === productId), (row) => row.quantity)
  )
}

function filterByDate(rows: Array<DemoTransaction>, from: string, to: string) {
  return rows.filter((row) => row.date >= from && row.date <= to)
}

function matchesFilters(row: DemoTransaction, filters: TransactionFilters) {
  if (filters.search) {
    const term = filters.search.toLowerCase()
    const matches =
      row.productName.toLowerCase().includes(term) ||
      String(row.id).includes(term)
    if (!matches) {
      return false
    }
  }

  if (filters.from && row.date < filters.from) {
    return false
  }

  if (filters.to && row.date > filters.to) {
    return false
  }

  if (filters.product && row.productId !== filters.product) {
    return false
  }

  return true
}

function compareTransactions(
  a: DemoTransaction,
  b: DemoTransaction,
  sort: TransactionSort,
  direction: 'asc' | 'desc',
) {
  const multiplier = direction === 'asc' ? 1 : -1
  const left = sortValue(a, sort)
  const right = sortValue(b, sort)

  if (typeof left === 'string' && typeof right === 'string') {
    return (left.localeCompare(right) || b.id - a.id) * multiplier
  }

  return ((left as number) - (right as number) || b.id - a.id) * multiplier
}

function sortValue(row: DemoTransaction, sort: TransactionSort) {
  const values: Record<TransactionSort, string | number> = {
    id: row.id,
    date: row.date,
    product: row.productName,
    quantity: row.quantity,
    price: row.unitPrice,
    total: row.total,
  }

  return values[sort]
}

function sum<T>(rows: Array<T>, getter: (row: T) => number) {
  return rows.reduce((total, row) => total + getter(row), 0)
}

import type {
  DashboardTotals,
  RecentActivity,
  StockAlert,
} from '../repositories/dashboard.repository.server'
import type { SessionUser } from '../auth/session.server'
import type {
  InventorySnapshot,
  MonthlyTrendPoint,
  ProductCatalogItem,
  ProductOption,
  ReportFilters,
  ReportOverview,
  TransactionFilters,
  TransactionListMetrics,
  TransactionMutationInput,
  TransactionRow,
  TransactionSort,
  TransactionSummary,
  TransactionType,
} from '~/lib/transactions'
import { currentMonthRange } from '~/lib/dates'

type DemoTransaction = TransactionRow & {
  type: TransactionType
}

export const demoUser: SessionUser = {
  id: 1,
  username: 'admin',
  displayName: 'CV SYAFA WATER',
  role: 'Admin',
}

const products: Array<ProductOption> = [
  {
    id: 1,
    sku: 'BRG-001',
    name: 'Galon',
    unit: 'pcs',
    minimumStock: 100,
    productionPrice: 5_000,
    salePrice: 10_000,
    active: true,
  },
  {
    id: 2,
    sku: 'BRG-002',
    name: 'Cup',
    unit: 'dus',
    minimumStock: 100,
    productionPrice: 2_000,
    salePrice: 5_000,
    active: true,
  },
  {
    id: 3,
    sku: 'BRG-003',
    name: 'Botol 330 ml',
    unit: 'dus',
    minimumStock: 120,
    productionPrice: 3_000,
    salePrice: 6_000,
    active: true,
  },
  {
    id: 4,
    sku: 'BRG-004',
    name: 'Botol 600 ml',
    unit: 'dus',
    minimumStock: 100,
    productionPrice: 4_000,
    salePrice: 7_000,
    active: true,
  },
]

const productionRows: Array<DemoTransaction> = [
  production(96, 3, relativeDate(0, 28), 200),
  production(102, 4, relativeDate(0, 28), 1_000),
  production(103, 4, relativeDate(0, 22), 700),
  production(97, 4, relativeDate(1, 19), 200),
  production(98, 2, relativeDate(2, 22), 900),
  production(100, 3, relativeDate(3, 16), 500),
  production(99, 1, relativeDate(4, 13), 800),
  production(104, 1, relativeDate(4, 20), 2_000),
  production(101, 2, relativeDate(5, 22), 1_000),
]

const salesRows: Array<DemoTransaction> = [
  sale(35, 3, relativeDate(0, 28), 400),
  sale(36, 4, relativeDate(1, 19), 500),
  sale(37, 2, relativeDate(2, 7), 1_000),
  sale(38, 1, relativeDate(3, 23), 500),
  sale(39, 3, relativeDate(4, 20), 200),
]

let nextProductionId = 105
let nextSalesId = 40

export function demoProductOptions(): Array<ProductOption> {
  const inventory = buildInventoryItems()

  return products.map((product) => ({
    ...product,
    available:
      inventory.find((item) => item.id === product.id)?.available ?? 0,
  }))
}

export function demoProductCatalog(): Array<ProductCatalogItem> {
  return buildInventoryItems().map((item) => ({
    ...item,
    available: item.available,
    rejected: item.rejected,
  }))
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
    stockUnits: sum(buildInventoryItems(), (item) => item.available),
  }
}

export function demoStockAlerts(limit = 5): Array<StockAlert> {
  return buildInventoryItems()
    .filter((product) => product.available <= product.minimumStock)
    .sort((a, b) => a.available - b.available || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((product) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      unit: product.unit,
      available: product.available,
      minimumStock: product.minimumStock,
      status: product.available <= 0 ? 'out' : 'low',
    }))
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

export function demoMonthlyTrend(months = 6): Array<MonthlyTrendPoint> {
  const today = new Date()

  return Array.from({ length: months }, (_, index) => {
    const offset = months - index - 1
    const date = new Date(today.getFullYear(), today.getMonth() - offset, 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    return {
      label: monthLabel(key),
      revenue: sum(
        salesRows.filter((row) => row.date.startsWith(key)),
        (row) => row.total,
      ),
      cost: sum(
        productionRows.filter((row) => row.date.startsWith(key)),
        (row) => row.total,
      ),
    }
  })
}

export function demoInventorySnapshot(): InventorySnapshot {
  const items = buildInventoryItems()

  return {
    totalItems: products.length,
    totalStock: sum(items, (item) => item.available),
    rejected: sum(items, (item) => item.rejected),
    items,
  }
}

export function demoReportOverview(filters: ReportFilters): ReportOverview {
  const monthlySales = filterReportRows(salesRows, filters)
  const monthlyProduction = filterReportRows(productionRows, filters)
  const revenue = sum(monthlySales, (row) => row.total)
  const cost = sum(monthlyProduction, (row) => row.total)

  return {
    period: {
      from: filters.from,
      to: filters.to,
    },
    products: demoProductOptions(),
    revenue,
    cost,
    profit: revenue - cost,
    salesRows: sortRows(monthlySales),
    productionRows: sortRows(monthlyProduction),
    trend: trendForRange(monthlySales, monthlyProduction, filters.from, filters.to),
  }
}

export function demoTransactionRows(
  type: TransactionType,
  filters: TransactionFilters,
): {
  rows: Array<TransactionRow>
  metrics: TransactionListMetrics
  summary: TransactionSummary
  total: number
  page: number
  pages: number
  fromRow: number
  toRow: number
} {
  const source = sourceRows(type)
  const filtered = source
    .filter((row) => matchesFilters(row, filters))
    .sort((a, b) => compareTransactions(a, b, filters.sort, filters.direction))
  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / filters.perPage))
  const page = Math.min(filters.page, pages)
  const offset = (page - 1) * filters.perPage
  const rows = filtered.slice(offset, offset + filters.perPage)

  return {
    rows: rows.map(stripType),
    metrics: {
      units: sum(filtered, (row) => row.quantity),
      valueTotal: sum(filtered, (row) => row.total),
      averageTotal: total ? sum(filtered, (row) => row.total) / total : 0,
    },
    summary: transactionSummary(type),
    total,
    page,
    pages,
    fromRow: total ? offset + 1 : 0,
    toRow: Math.min(offset + filters.perPage, total),
  }
}

export function demoTransactionById(
  type: TransactionType,
  id: number,
): TransactionRow | null {
  const row = sourceRows(type).find((item) => item.id === id)
  return row ? stripType(row) : null
}

export function saveDemoTransaction(
  type: TransactionType,
  input: TransactionMutationInput,
): TransactionRow {
  const source = sourceRows(type)
  const product = products.find((item) => item.id === input.productId)
  if (!product) {
    throw new Error(`Missing demo product: ${input.productId}`)
  }

  const existingIndex = input.id
    ? source.findIndex((row) => row.id === input.id)
    : -1
  if (input.id && existingIndex < 0) {
    throw new Error(`Missing demo transaction: ${input.id}`)
  }

  const existing = existingIndex >= 0 ? source[existingIndex] : null
  if (type === 'sales') {
    const available = availableForSale(product.id, existing)
    if (input.quantity > available) {
      throw new Error(
        `Stok ${product.name} tersedia ${available} ${product.unit}.`,
      )
    }
  }

  const id = input.id ?? nextId(type)
  const unitPrice =
    input.unitPrice && input.unitPrice > 0
      ? input.unitPrice
      : defaultPrice(type, product)
  const note = input.note?.trim() || null
  const row = transaction(
    type,
    id,
    product.id,
    input.date,
    input.quantity,
    unitPrice,
    note,
  )

  if (existingIndex >= 0) {
    source[existingIndex] = row
  } else {
    source.push(row)
  }

  return stripType(row)
}

export function deleteDemoTransaction(type: TransactionType, id: number) {
  const source = sourceRows(type)
  const index = source.findIndex((row) => row.id === id)
  if (index >= 0) {
    source.splice(index, 1)
  }

  return index >= 0
}

function production(
  id: number,
  productId: number,
  date: string,
  quantity: number,
): DemoTransaction {
  const product = requireProduct(productId)
  return transaction('production', id, productId, date, quantity, product.productionPrice)
}

function sale(
  id: number,
  productId: number,
  date: string,
  quantity: number,
): DemoTransaction {
  const product = requireProduct(productId)
  return transaction('sales', id, productId, date, quantity, product.salePrice)
}

function transaction(
  type: TransactionType,
  id: number,
  productId: number,
  date: string,
  quantity: number,
  unitPrice: number,
  note: string | null = null,
): DemoTransaction {
  const product = requireProduct(productId)

  return {
    id,
    type,
    productId,
    productName: product.name,
    date,
    quantity,
    unitPrice,
    total: quantity * unitPrice,
    note,
  }
}

function transactionSummary(type: TransactionType): TransactionSummary {
  const source = sourceRows(type)
  const today = dateInputValue(new Date())
  const { from, to } = currentMonthRange()
  const year = from.slice(0, 4)
  const dayRows = source.filter((row) => row.date === today)
  const monthRows = filterByDate(source, from, to)
  const yearRows = source.filter((row) => row.date.startsWith(year))

  return {
    dayTotal: sum(dayRows, (row) => row.total),
    monthTotal: sum(monthRows, (row) => row.total),
    yearTotal: sum(yearRows, (row) => row.total),
    dayUnits: sum(dayRows, (row) => row.quantity),
    monthUnits: sum(monthRows, (row) => row.quantity),
    yearUnits: sum(yearRows, (row) => row.quantity),
  }
}

function buildInventoryItems() {
  return products.map((product) => {
    const produced = sum(
      productionRows.filter((row) => row.productId === product.id),
      (row) => row.quantity,
    )
    const sold = sum(
      salesRows.filter((row) => row.productId === product.id),
      (row) => row.quantity,
    )
    const adjustment = 0
    const balance = produced + adjustment - sold

    return {
      ...product,
      produced,
      sold,
      adjustment,
      available: Math.max(0, balance),
      rejected: Math.max(0, -balance),
    }
  })
}

function availableForSale(productId: number, existing: DemoTransaction | null) {
  const current =
    buildInventoryItems().find((item) => item.id === productId)?.available ?? 0

  if (existing?.type === 'sales' && existing.productId === productId) {
    return current + existing.quantity
  }

  return current
}

function sourceRows(type: TransactionType) {
  return type === 'production' ? productionRows : salesRows
}

function stripType(row: DemoTransaction): TransactionRow {
  const { type: _type, ...transactionRow } = row
  return transactionRow
}

function sortRows(rows: Array<DemoTransaction>) {
  return [...rows]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .map(stripType)
}

function filterByDate(rows: Array<DemoTransaction>, from: string, to: string) {
  return rows.filter((row) => row.date >= from && row.date <= to)
}

function filterReportRows(rows: Array<DemoTransaction>, filters: ReportFilters) {
  return filterByDate(rows, filters.from, filters.to).filter(
    (row) => !filters.product || row.productId === filters.product,
  )
}

function matchesFilters(row: DemoTransaction, filters: TransactionFilters) {
  if (filters.search) {
    const term = filters.search.toLowerCase()
    const matches =
      row.productName.toLowerCase().includes(term) ||
      String(row.id).includes(term) ||
      String(row.productId).includes(term)
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

function requireProduct(productId: number) {
  const product = products.find((item) => item.id === productId)
  if (!product) {
    throw new Error(`Missing demo product: ${productId}`)
  }

  return product
}

function trendForRange(
  sales: Array<DemoTransaction>,
  production: Array<DemoTransaction>,
  from: string,
  to: string,
): Array<MonthlyTrendPoint> {
  return monthKeys(from, to)
    .slice(-6)
    .map((key) => ({
      label: monthLabel(key),
      revenue: sum(
        sales.filter((row) => row.date.startsWith(key)),
        (row) => row.total,
      ),
      cost: sum(
        production.filter((row) => row.date.startsWith(key)),
        (row) => row.total,
      ),
    }))
}

function monthKeys(from: string, to: string) {
  const start = new Date(`${from.slice(0, 7)}-01T00:00:00+07:00`)
  const end = new Date(`${to.slice(0, 7)}-01T00:00:00+07:00`)
  const keys: Array<string> = []

  for (
    const date = start;
    date <= end;
    date.setMonth(date.getMonth() + 1)
  ) {
    keys.push(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
    )
  }

  return keys
}

function monthLabel(key: string) {
  const [year, month] = key.split('-').map(Number)
  return new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(
    new Date(year, month - 1, 1),
  )
}

function defaultPrice(type: TransactionType, product: ProductOption) {
  return type === 'production' ? product.productionPrice : product.salePrice
}

function nextId(type: TransactionType) {
  if (type === 'production') {
    return nextProductionId++
  }

  return nextSalesId++
}

function relativeDate(monthsAgo: number, day: number) {
  const today = new Date()
  const date = new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  return dateInputValue(
    new Date(date.getFullYear(), date.getMonth(), Math.min(day, lastDay)),
  )
}

function dateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function sum<T>(rows: Array<T>, getter: (row: T) => number) {
  return rows.reduce((total, row) => total + getter(row), 0)
}

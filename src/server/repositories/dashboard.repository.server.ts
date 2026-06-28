import {
  demoDashboardTotals,
  demoMonthlyTrend,
  demoRecentActivity,
  demoStockAlerts,
} from '../demo/demo-data.server'
import type { MonthlyTrendPoint } from '~/lib/transactions'

export type DashboardTotals = {
  revenue: number
  cost: number
  profit: number
  salesUnits: number
  productionUnits: number
  stockUnits: number
}

export type StockAlert = {
  id: number
  sku: string
  name: string
  unit: string
  available: number
  minimumStock: number
  status: 'low' | 'out'
}

export type RecentActivity = {
  id: number
  type: 'production' | 'sale'
  productName: string
  quantity: number
  unitPrice: number
  total: number
  date: string
}

export async function dashboardTotals(
  from: string,
  to: string,
): Promise<DashboardTotals> {
  return demoDashboardTotals(from, to)
}

export async function stockAlerts(limit = 5): Promise<Array<StockAlert>> {
  return demoStockAlerts(limit)
}

export async function recentActivity(limit = 6): Promise<Array<RecentActivity>> {
  return demoRecentActivity(limit)
}

export async function monthlyTrend(
  months = 6,
): Promise<Array<MonthlyTrendPoint>> {
  return demoMonthlyTrend(months)
}

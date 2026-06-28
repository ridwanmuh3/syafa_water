import { currentMonthRange } from '~/lib/dates'
import type { DashboardFilters, ReportFilters } from '~/lib/transactions'
import {
  dashboardTotals,
  monthlyTrend,
  recentActivity,
  stockAlerts,
} from '../repositories/dashboard.repository.server'
import {
  demoInventorySnapshot,
  demoProductCatalog,
  demoReportOverview,
} from '../demo/demo-data.server'

export async function getDashboardOverview(filters?: DashboardFilters) {
  const period = filters ?? currentMonthRange()
  const [totals, alerts, activity, trend] = await Promise.all([
    dashboardTotals(period.from, period.to),
    stockAlerts(),
    recentActivity(),
    monthlyTrend(),
  ])

  return {
    period,
    totals,
    alerts,
    activity,
    trend,
  }
}

export async function getInventorySnapshot() {
  return demoInventorySnapshot()
}

export async function getReportsOverview(filters: ReportFilters) {
  return demoReportOverview(filters)
}

export async function getProductCatalog() {
  return demoProductCatalog()
}

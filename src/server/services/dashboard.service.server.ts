import { currentMonthRange } from '~/lib/dates'
import {
  dashboardTotals,
  recentActivity,
  stockAlerts,
} from '../repositories/dashboard.repository.server'

export async function getDashboardOverview() {
  const period = currentMonthRange()
  const [totals, alerts, activity] = await Promise.all([
    dashboardTotals(period.from, period.to),
    stockAlerts(),
    recentActivity(),
  ])

  return {
    period,
    totals,
    alerts,
    activity,
  }
}

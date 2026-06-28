import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { dashboardPeriods, reportTabs } from '~/lib/transactions'
import { requireCurrentUser } from '../auth/auth.functions'

const dashboardFiltersSchema = z.object({
  period: z.enum(dashboardPeriods),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

const reportFiltersSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  product: z.number().int().nonnegative(),
  tab: z.enum(reportTabs),
})

export const getDashboardOverviewFn = createServerFn({ method: 'GET' })
  .validator(dashboardFiltersSchema)
  .handler(async ({ data }) => {
    await requireCurrentUser()
    const { getDashboardOverview } = await import(
      '../services/dashboard.service.server'
    )
    return getDashboardOverview(data)
  })

export const getInventorySnapshotFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireCurrentUser()
    const { getInventorySnapshot } = await import(
      '../services/dashboard.service.server'
    )

    return getInventorySnapshot()
  },
)

export const getReportsOverviewFn = createServerFn({ method: 'GET' })
  .validator(reportFiltersSchema)
  .handler(async ({ data }) => {
    await requireCurrentUser()
    const { getReportsOverview } = await import(
      '../services/dashboard.service.server'
    )

    return getReportsOverview(data)
  })

export const getProductCatalogFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireCurrentUser()
    const { getProductCatalog } = await import(
      '../services/dashboard.service.server'
    )

    return getProductCatalog()
  },
)

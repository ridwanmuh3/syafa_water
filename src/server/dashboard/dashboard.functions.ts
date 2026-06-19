import { createServerFn } from '@tanstack/react-start'
import { requireCurrentUser } from '../auth/auth.functions'

export const getDashboardOverviewFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireCurrentUser()
    const { getDashboardOverview } = await import(
      '../services/dashboard.service.server'
    )
    return getDashboardOverview()
  },
)

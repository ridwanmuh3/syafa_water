import { createFileRoute, redirect } from '@tanstack/react-router'
import { normalizeDashboardSearch } from '~/lib/transactions'
import { getCurrentUserFn } from '~/server/auth/auth.functions'

export const Route = createFileRoute('/')({
  loader: async () => {
    const user = await getCurrentUserFn()
    if (user) {
      throw redirect({
        search: normalizeDashboardSearch({}),
        to: '/dashboard',
      })
    }

    throw redirect({ search: { redirect: undefined }, to: '/login' })
  },
})

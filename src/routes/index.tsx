import { createFileRoute, redirect } from '@tanstack/react-router'
import { getCurrentUserFn } from '~/server/auth/auth.functions'

export const Route = createFileRoute('/')({
  loader: async () => {
    const user = await getCurrentUserFn()
    throw redirect({ to: user ? '/dashboard' : '/login' })
  },
})

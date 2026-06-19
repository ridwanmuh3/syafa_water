import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell } from '~/components/app-shell/app-shell'
import { getCurrentUserFn } from '~/server/auth/auth.functions'

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUserFn()
    if (!user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    return { user }
  },
  component: AppLayout,
})

function AppLayout() {
  const { user } = Route.useRouteContext()
  return <AppShell user={user} />
}

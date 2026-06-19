import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import type { SessionUser } from './session.server'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  redirectTo: z.string().optional(),
})

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async () => getCurrentUser(),
)

export const loginFn = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(async ({ data }) => {
    const [{ useAppSession }, { authenticateUser }] = await Promise.all([
      import('./session.server'),
      import('../services/auth.service.server'),
    ])
    const user = await authenticateUser(data.username, data.password)
    if (!user) {
      return { ok: false, message: 'Username atau password tidak valid.' }
    }

    const session = await useAppSession()
    await session.update({ user })

    return {
      ok: true,
      redirectTo: safeRedirect(data.redirectTo),
    }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const { useAppSession } = await import('./session.server')
  const session = await useAppSession()
  await session.clear()

  return { ok: true }
})

export const getCurrentUser = createServerOnlyFn(
  async (): Promise<SessionUser | null> => {
    const [{ useAppSession }, { getSessionUserById }] = await Promise.all([
      import('./session.server'),
      import('../services/auth.service.server'),
    ])

    const session = await useAppSession()
    const userId = session.data.user?.id
    if (!userId) {
      return null
    }

    return getSessionUserById(userId)
  },
)

export const requireCurrentUser = createServerOnlyFn(
  async (): Promise<SessionUser> => {
    const user = await getCurrentUser()
    if (!user) {
      throw redirect({ to: '/login', search: { redirect: undefined } })
    }

    return user
  },
)

function safeRedirect(value: string | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard'
  }

  return value
}

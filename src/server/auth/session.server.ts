import { useSession } from '@tanstack/react-start/server'
import { getEnv } from '../env'

export type SessionUser = {
  id: number
  username: string
  displayName: string
  role: string
}

type SessionData = {
  user?: SessionUser
}

export function useAppSession() {
  const env = getEnv()

  return useSession<SessionData>({
    name: 'syafa-session',
    password: env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      path: '/',
    },
  })
}

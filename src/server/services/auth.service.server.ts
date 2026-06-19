import type { SessionUser } from '../auth/session.server'
import { demoUser } from '../demo/demo-data.server'

export async function authenticateUser(
  username: string,
  password: string,
): Promise<SessionUser | null> {
  return username === demoUser.username && password === 'admin123'
    ? demoUser
    : null
}

export async function getSessionUserById(id: number) {
  return id === demoUser.id ? demoUser : null
}

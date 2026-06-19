import { z } from 'zod'

const envSchema = z.object({
  SESSION_SECRET: z.string().min(32).optional(),
  NODE_ENV: z.string().default('development'),
})

type Env = Omit<z.infer<typeof envSchema>, 'SESSION_SECRET'> & {
  SESSION_SECRET: string
}

export function getEnv(): Env {
  const env = envSchema.parse(process.env)

  if (env.SESSION_SECRET) {
    return { ...env, SESSION_SECRET: env.SESSION_SECRET }
  }

  if (env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set in production')
  }

  return {
    ...env,
    SESSION_SECRET: 'local-development-session-secret-32',
  }
}

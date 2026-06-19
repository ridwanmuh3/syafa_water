import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { getCurrentUserFn, loginFn } from '~/server/auth/auth.functions'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { Input } from '~/components/ui/input'

export const Route = createFileRoute('/login')({
  validateSearch: (search) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  beforeLoad: async () => {
    const user = await getCurrentUserFn()
    if (user) {
      return { signedIn: true }
    }

    return { signedIn: false }
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const search = Route.useSearch()
  const { signedIn } = Route.useRouteContext()
  const login = useServerFn(loginFn)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (signedIn) {
    router.navigate({ to: '/dashboard' })
    return null
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-[420px]">
        <form
          className="rounded-card border border-border bg-surface p-6 shadow-card"
          onSubmit={async (event) => {
            event.preventDefault()
            setError('')
            setLoading(true)

            const form = new FormData(event.currentTarget)
            const result = await login({
              data: {
                username: String(form.get('username') ?? ''),
                password: String(form.get('password') ?? ''),
                redirectTo: search.redirect,
              },
            })

            setLoading(false)
            if (!result.ok) {
              setError(result.message)
              return
            }

            router.navigate({ to: result.redirectTo })
          }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-card bg-brand-600 text-white">
              <Icon className="h-5 w-5" name="droplet" />
            </span>
            <p className="text-sm font-semibold text-brand-700">Syafa Water</p>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-text">Sign in</h1>
          <div className="mt-5 rounded-card border border-brand-100 bg-brand-50 px-4 py-3 text-sm">
            <p className="inline-flex items-center gap-2 font-semibold text-text">
              <Icon name="key" />
              Demo account
            </p>
            <dl className="mt-2 grid grid-cols-[92px_1fr] gap-y-1 text-muted">
              <dt>Username</dt>
              <dd className="font-mono text-text">admin</dd>
              <dt>Password</dt>
              <dd className="font-mono text-text">admin123</dd>
            </dl>
          </div>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-text">
                <Icon className="h-3.5 w-3.5 text-muted" name="user" />
                Username
              </span>
              <Input
                className="mt-1"
                name="username"
                autoComplete="username"
                defaultValue="admin"
                required
              />
            </label>
            <label className="block">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-text">
                <Icon className="h-3.5 w-3.5 text-muted" name="lock" />
                Password
              </span>
              <div className="mt-1 flex rounded-control border border-border bg-surface focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
                <input
                  className="min-h-10 min-w-0 flex-1 rounded-control border-0 bg-transparent px-3 text-sm outline-none"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  defaultValue="admin123"
                  required
                />
                <button
                  className="px-3 text-sm font-semibold text-brand-700"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>
          </div>
          {error ? (
            <p className="mt-4 rounded-control border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          ) : null}
          <Button className="mt-6 w-full" type="submit" disabled={loading}>
            <Icon name="key" />
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </section>
    </main>
  )
}

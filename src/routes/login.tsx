import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { Icon } from '~/components/ui/icon'
import { normalizeDashboardSearch } from '~/lib/transactions'
import { getCurrentUserFn, loginFn } from '~/server/auth/auth.functions'

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
    router.navigate({ search: normalizeDashboardSearch({}), to: '/dashboard' })
    return null
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-visual" aria-label="Syafa Water Operations">
          <div className="login-brand">
            <span className="brand-mark" aria-hidden="true">
              S
            </span>
            <div>
              <strong>Syafa Water</strong>
              <br />
              <small>Operations</small>
            </div>
          </div>
          <div className="login-copy">
            <h1>Operasional air minum, lebih jernih.</h1>
            <p>Pantau produksi, penjualan, stok, dan laba dari satu dashboard.</p>
          </div>
        </div>

        <section className="login-form-panel">
          <h2>Selamat datang</h2>
          <p>Masuk dengan akun administrator.</p>
          {error ? (
            <div className="inline-alert" role="alert">
              <Icon name="alert" />
              <span>{error}</span>
            </div>
          ) : null}
          <form
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

              window.location.assign(result.redirectTo)
            }}
          >
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                defaultValue="admin"
                required
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-with-button">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  defaultValue="admin123"
                  required
                />
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Tampilkan password"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  <Icon name="eye" />
                </button>
              </div>
            </div>
            <button className="button button-primary" type="submit" disabled={loading}>
              {loading ? 'Memeriksa...' : 'Masuk'}
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}

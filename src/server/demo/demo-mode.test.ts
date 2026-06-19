import { describe, expect, it } from 'vitest'
import { normalizeTransactionSearch } from '~/lib/transactions'
import { authenticateUser } from '../services/auth.service.server'
import { getTransactionList } from '../services/transactions.service.server'
import { getDashboardOverview } from '../services/dashboard.service.server'

describe('demo data', () => {
  it('serves auth and operational data without external services', async () => {
    await expect(authenticateUser('admin', 'admin123')).resolves.toMatchObject({
      username: 'admin',
    })

    await expect(getDashboardOverview()).resolves.toMatchObject({
      totals: expect.objectContaining({
        revenue: expect.any(Number),
        cost: expect.any(Number),
      }),
    })

    await expect(
      getTransactionList('sales', normalizeTransactionSearch({ q: 'cup' })),
    ).resolves.toMatchObject({
      rows: expect.any(Array),
      total: expect.any(Number),
    })
  })
})

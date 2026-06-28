import { describe, expect, it } from 'vitest'
import {
  normalizeDashboardSearch,
  normalizeReportSearch,
  normalizeTransactionSearch,
} from '~/lib/transactions'
import { authenticateUser } from '../services/auth.service.server'
import {
  deleteTransactionEntry,
  getTransactionList,
  saveTransactionEntry,
} from '../services/transactions.service.server'
import {
  getDashboardOverview,
  getInventorySnapshot,
  getReportsOverview,
} from '../services/dashboard.service.server'

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

  it('keeps transaction changes synchronized across sections', async () => {
    const filters = normalizeDashboardSearch({})
    const beforeDashboard = await getDashboardOverview(filters)
    const beforeInventory = await getInventorySnapshot()
    const row = await saveTransactionEntry('production', {
      productId: 1,
      date: filters.from,
      quantity: 7,
      unitPrice: 5_000,
      note: 'sync test',
    })

    try {
      const afterDashboard = await getDashboardOverview(filters)
      const afterInventory = await getInventorySnapshot()
      const report = await getReportsOverview(
        normalizeReportSearch({
          from: filters.from,
          product: String(row.productId),
          to: filters.to,
        }),
      )

      expect(afterDashboard.totals.productionUnits).toBe(
        beforeDashboard.totals.productionUnits + row.quantity,
      )
      expect(afterInventory.totalStock).toBe(
        beforeInventory.totalStock + row.quantity,
      )
      expect(report.products).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: row.productId })]),
      )
      expect(report.productionRows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: row.id, note: 'sync test' }),
        ]),
      )
    } finally {
      await deleteTransactionEntry('production', row.id)
    }
  })
})

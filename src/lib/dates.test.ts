import { describe, expect, it } from 'vitest'
import { currentMonthRange } from './dates'
import { normalizeTransactionSearch, transactionHref } from './transactions'

describe('currentMonthRange', () => {
  it('returns first and last date for given month', () => {
    expect(currentMonthRange(new Date('2026-06-19T12:00:00+07:00'))).toEqual({
      from: '2026-06-01',
      to: '2026-06-30',
    })
  })
})

describe('transaction filters', () => {
  it('normalizes unsupported search params', () => {
    expect(
      normalizeTransactionSearch({
        q: ' cup ',
        sort: 'bad',
        direction: 'sideways',
        page: '-1',
        per_page: '25',
      }),
    ).toMatchObject({
      search: 'cup',
      sort: 'date',
      direction: 'desc',
      page: 1,
      perPage: 25,
    })
  })

  it('builds compact hrefs', () => {
    const filters = normalizeTransactionSearch({ q: 'cup', page: '2' })

    expect(transactionHref('/sales', filters, { page: 1 })).toBe('/sales?q=cup')
  })
})

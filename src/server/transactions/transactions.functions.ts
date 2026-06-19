import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import {
  transactionDirections,
  transactionPageSizes,
  transactionSorts,
} from '~/lib/transactions'
import { requireCurrentUser } from '../auth/auth.functions'

const transactionListSchema = z.object({
  type: z.enum(['production', 'sales']),
  filters: z.object({
    search: z.string(),
    from: z.string(),
    to: z.string(),
    product: z.number().int().nonnegative(),
    sort: z.enum(transactionSorts),
    direction: z.enum(transactionDirections),
    page: z.number().int().positive(),
    perPage: z
      .number()
      .refine(
        (value): value is (typeof transactionPageSizes)[number] =>
          transactionPageSizes.includes(
            value as (typeof transactionPageSizes)[number],
          ),
      ),
  }),
})

export const getTransactionListFn = createServerFn({ method: 'GET' })
  .validator(transactionListSchema)
  .handler(async ({ data }) => {
    await requireCurrentUser()
    const { getTransactionList } = await import(
      '../services/transactions.service.server'
    )

    return getTransactionList(data.type, data.filters)
  })

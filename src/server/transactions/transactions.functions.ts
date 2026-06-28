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

const transactionLookupSchema = z.object({
  type: z.enum(['production', 'sales']),
  id: z.number().int().positive().optional(),
})

const transactionDeleteSchema = z.object({
  type: z.enum(['production', 'sales']),
  id: z.number().int().positive(),
})

const transactionMutationSchema = z.object({
  type: z.enum(['production', 'sales']),
  id: z.number().int().positive().optional(),
  productId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative().optional(),
  note: z.string().max(500).optional(),
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

export const getTransactionFormFn = createServerFn({ method: 'GET' })
  .validator(transactionLookupSchema)
  .handler(async ({ data }) => {
    await requireCurrentUser()
    const { getTransactionForm } = await import(
      '../services/transactions.service.server'
    )

    return getTransactionForm(data.type, data.id)
  })

export const saveTransactionFn = createServerFn({ method: 'POST' })
  .validator(transactionMutationSchema)
  .handler(async ({ data }) => {
    await requireCurrentUser()
    const { saveTransactionEntry } = await import(
      '../services/transactions.service.server'
    )

    return saveTransactionEntry(data.type, {
      id: data.id,
      productId: data.productId,
      date: data.date,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      note: data.note,
    })
  })

export const deleteTransactionFn = createServerFn({ method: 'POST' })
  .validator(transactionDeleteSchema)
  .handler(async ({ data }) => {
    await requireCurrentUser()
    const { deleteTransactionEntry } = await import(
      '../services/transactions.service.server'
    )

    return deleteTransactionEntry(data.type, data.id)
  })

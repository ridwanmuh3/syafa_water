import type {
  TransactionFilters,
  TransactionListResult,
  TransactionType,
} from '~/lib/transactions'
import { productOptions } from '../repositories/products.repository.server'
import { transactionRows } from '../repositories/transactions.repository.server'

export async function getTransactionList(
  type: TransactionType,
  filters: TransactionFilters,
): Promise<TransactionListResult> {
  const [transactions, products] = await Promise.all([
    transactionRows(type, filters),
    productOptions(),
  ])

  return {
    ...transactions,
    products,
  }
}

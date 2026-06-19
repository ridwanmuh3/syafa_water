import type {
  TransactionFilters,
  TransactionListMetrics,
  TransactionRow,
  TransactionType,
} from '~/lib/transactions'
import { demoTransactionRows } from '../demo/demo-data.server'

export async function transactionRows(
  type: TransactionType,
  filters: TransactionFilters,
): Promise<{
  rows: Array<TransactionRow>
  metrics: TransactionListMetrics
  total: number
  page: number
  pages: number
  fromRow: number
  toRow: number
}> {
  return demoTransactionRows(type, filters)
}

import type {
  TransactionFilters,
  TransactionListMetrics,
  TransactionMutationInput,
  TransactionRow,
  TransactionSummary,
  TransactionType,
} from '~/lib/transactions'
import {
  deleteDemoTransaction,
  demoTransactionById,
  demoTransactionRows,
  saveDemoTransaction,
} from '../demo/demo-data.server'

export async function transactionRows(
  type: TransactionType,
  filters: TransactionFilters,
): Promise<{
  rows: Array<TransactionRow>
  metrics: TransactionListMetrics
  summary: TransactionSummary
  total: number
  page: number
  pages: number
  fromRow: number
  toRow: number
}> {
  return demoTransactionRows(type, filters)
}

export async function transactionById(type: TransactionType, id: number) {
  return demoTransactionById(type, id)
}

export async function saveTransaction(
  type: TransactionType,
  input: TransactionMutationInput,
) {
  return saveDemoTransaction(type, input)
}

export async function deleteTransaction(type: TransactionType, id: number) {
  return deleteDemoTransaction(type, id)
}

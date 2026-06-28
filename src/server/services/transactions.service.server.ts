import type {
  TransactionFilters,
  TransactionListResult,
  TransactionMutationInput,
  TransactionType,
} from '~/lib/transactions'
import { productOptions } from '../repositories/products.repository.server'
import {
  deleteTransaction,
  saveTransaction,
  transactionById,
  transactionRows,
} from '../repositories/transactions.repository.server'

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

export async function getTransactionForm(type: TransactionType, id?: number) {
  const [products, row] = await Promise.all([
    productOptions(),
    id ? transactionById(type, id) : Promise.resolve(null),
  ])

  return {
    products,
    row,
  }
}

export async function saveTransactionEntry(
  type: TransactionType,
  input: TransactionMutationInput,
) {
  return saveTransaction(type, input)
}

export async function deleteTransactionEntry(type: TransactionType, id: number) {
  return deleteTransaction(type, id)
}

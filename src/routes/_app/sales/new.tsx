import { createFileRoute } from '@tanstack/react-router'
import { TransactionFormPage } from '~/features/transactions/transaction-form-page'
import { getTransactionFormFn } from '~/server/transactions/transactions.functions'

export const Route = createFileRoute('/_app/sales/new')({
  loader: async () => getTransactionFormFn({ data: { type: 'sales' } }),
  component: SalesNewPage,
})

function SalesNewPage() {
  const data = Route.useLoaderData()

  return (
    <TransactionFormPage type="sales" products={data.products} row={data.row} />
  )
}

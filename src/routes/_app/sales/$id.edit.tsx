import { createFileRoute } from '@tanstack/react-router'
import { TransactionFormPage } from '~/features/transactions/transaction-form-page'
import { getTransactionFormFn } from '~/server/transactions/transactions.functions'

export const Route = createFileRoute('/_app/sales/$id/edit')({
  loader: async ({ params }) =>
    getTransactionFormFn({ data: { type: 'sales', id: Number(params.id) } }),
  component: SalesEditPage,
})

function SalesEditPage() {
  const data = Route.useLoaderData()

  return (
    <TransactionFormPage type="sales" products={data.products} row={data.row} />
  )
}

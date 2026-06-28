import { createFileRoute } from '@tanstack/react-router'
import { TransactionFormPage } from '~/features/transactions/transaction-form-page'
import { getTransactionFormFn } from '~/server/transactions/transactions.functions'

export const Route = createFileRoute('/_app/production/$id/edit')({
  loader: async ({ params }) =>
    getTransactionFormFn({
      data: { type: 'production', id: Number(params.id) },
    }),
  component: ProductionEditPage,
})

function ProductionEditPage() {
  const data = Route.useLoaderData()

  return (
    <TransactionFormPage
      type="production"
      products={data.products}
      row={data.row}
    />
  )
}

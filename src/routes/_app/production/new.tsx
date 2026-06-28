import { createFileRoute } from '@tanstack/react-router'
import { TransactionFormPage } from '~/features/transactions/transaction-form-page'
import { getTransactionFormFn } from '~/server/transactions/transactions.functions'

export const Route = createFileRoute('/_app/production/new')({
  loader: async () => getTransactionFormFn({ data: { type: 'production' } }),
  component: ProductionNewPage,
})

function ProductionNewPage() {
  const data = Route.useLoaderData()

  return (
    <TransactionFormPage
      type="production"
      products={data.products}
      row={data.row}
    />
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { TransactionListPage } from '~/features/transactions/transaction-list-page'
import { normalizeTransactionSearch } from '~/lib/transactions'
import { getTransactionListFn } from '~/server/transactions/transactions.functions'

export const Route = createFileRoute('/_app/production/')({
  validateSearch: (search) => normalizeTransactionSearch(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) =>
    getTransactionListFn({ data: { type: 'production', filters: deps } }),
  component: ProductionPage,
})

function ProductionPage() {
  const filters = Route.useSearch()
  const data = Route.useLoaderData()

  return <TransactionListPage type="production" filters={filters} data={data} />
}

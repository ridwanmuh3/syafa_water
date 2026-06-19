import { createFileRoute } from '@tanstack/react-router'
import { TransactionListPage } from '~/features/transactions/transaction-list-page'
import { normalizeTransactionSearch } from '~/lib/transactions'
import { getTransactionListFn } from '~/server/transactions/transactions.functions'

export const Route = createFileRoute('/_app/sales/')({
  validateSearch: (search) => normalizeTransactionSearch(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) =>
    getTransactionListFn({ data: { type: 'sales', filters: deps } }),
  component: SalesPage,
})

function SalesPage() {
  const filters = Route.useSearch()
  const data = Route.useLoaderData()

  return <TransactionListPage type="sales" filters={filters} data={data} />
}

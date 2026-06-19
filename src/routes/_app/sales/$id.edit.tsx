import { createFileRoute } from '@tanstack/react-router'
import { ModulePanel } from '~/components/module-panel'
import { PageHeader } from '~/components/page-header'

export const Route = createFileRoute('/_app/sales/$id/edit')({
  component: SalesEditPage,
})

function SalesEditPage() {
  const { id } = Route.useParams()

  return (
    <>
      <PageHeader
        icon="edit"
        title={`Edit sale #${id}`}
        description="Demo edit shell for sales rows."
      />
      <ModulePanel
        icon="cart"
        title="Sales edit"
        description="Read-only MVP view keeps edit intent visible without persistence."
        items={['Sale ID', 'Product', 'Revenue']}
      />
    </>
  )
}

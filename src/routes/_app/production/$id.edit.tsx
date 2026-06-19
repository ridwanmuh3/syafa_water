import { createFileRoute } from '@tanstack/react-router'
import { ModulePanel } from '~/components/module-panel'
import { PageHeader } from '~/components/page-header'

export const Route = createFileRoute('/_app/production/$id/edit')({
  component: ProductionEditPage,
})

function ProductionEditPage() {
  const { id } = Route.useParams()

  return (
    <>
      <PageHeader
        icon="edit"
        title={`Edit production #${id}`}
        description="Demo edit shell for production rows."
      />
      <ModulePanel
        icon="factory"
        title="Production edit"
        description="Read-only MVP view keeps edit intent visible without persistence."
        items={['Batch ID', 'Product', 'Cost']}
      />
    </>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { ModulePanel } from '~/components/module-panel'
import { PageHeader } from '~/components/page-header'

export const Route = createFileRoute('/_app/production/new')({
  component: ProductionNewPage,
})

function ProductionNewPage() {
  return (
    <>
      <PageHeader
        icon="factory"
        title="Add production"
        description="Demo form shell for production entry."
      />
      <ModulePanel
        icon="edit"
        title="Production form"
        description="MVP demo keeps production data read-only while showing intended fields."
        items={['Product', 'Quantity', 'Unit cost']}
      />
    </>
  )
}

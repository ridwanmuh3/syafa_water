import { createFileRoute } from '@tanstack/react-router'
import { ModulePanel } from '~/components/module-panel'
import { PageHeader } from '~/components/page-header'

export const Route = createFileRoute('/_app/sales/new')({
  component: SalesNewPage,
})

function SalesNewPage() {
  return (
    <>
      <PageHeader
        icon="cart"
        title="Add sale"
        description="Demo form shell for sales entry."
      />
      <ModulePanel
        icon="edit"
        title="Sales form"
        description="MVP demo keeps sales data read-only while showing intended fields."
        items={['Product', 'Quantity', 'Unit price']}
      />
    </>
  )
}

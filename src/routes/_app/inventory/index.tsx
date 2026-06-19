import { createFileRoute } from '@tanstack/react-router'
import { ModulePanel } from '~/components/module-panel'
import { PageHeader } from '~/components/page-header'

export const Route = createFileRoute('/_app/inventory/')({
  component: InventoryPage,
})

function InventoryPage() {
  return (
    <>
      <PageHeader
        icon="stock"
        title="Inventory"
        description="Demo stock overview for products, minimum levels, and alerts."
      />
      <ModulePanel
        icon="stock"
        title="Inventory snapshot"
        description="Inventory detail is represented in dashboard stock cards for this MVP."
        items={['Available stock', 'Minimum levels', 'Alert status']}
      />
    </>
  )
}

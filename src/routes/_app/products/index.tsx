import { createFileRoute } from '@tanstack/react-router'
import { ModulePanel } from '~/components/module-panel'
import { PageHeader } from '~/components/page-header'

export const Route = createFileRoute('/_app/products/')({
  component: ProductsPage,
})

function ProductsPage() {
  return (
    <>
      <PageHeader
        icon="package"
        title="Products"
        description="Demo product catalog used by production, sales, and inventory screens."
      />
      <ModulePanel
        icon="package"
        title="Product catalog"
        description="MVP catalog keeps product names, SKU labels, and units visible across demo data."
        items={['SKU detail', 'Product units', 'Active products']}
      />
    </>
  )
}

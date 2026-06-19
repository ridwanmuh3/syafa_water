import { createFileRoute } from '@tanstack/react-router'
import { ModulePanel } from '~/components/module-panel'
import { PageHeader } from '~/components/page-header'

export const Route = createFileRoute('/_app/reports/')({
  component: ReportsPage,
})

function ReportsPage() {
  return (
    <>
      <PageHeader
        icon="report"
        title="Reports"
        description="Current month summary for revenue, costs, stock, and transaction movement."
      />
      <ModulePanel
        icon="report"
        title="Report summary"
        description="Dashboard metrics provide demo report coverage without external services."
        items={['Revenue trend', 'Production cost', 'Stock movement']}
      />
    </>
  )
}

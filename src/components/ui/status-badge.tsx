import { cn } from '~/lib/cn'

const labels = {
  healthy: 'Healthy',
  low: 'Low stock',
  out: 'Out of stock',
}

const styles = {
  healthy: 'bg-green-50 text-success ring-green-200',
  low: 'bg-amber-50 text-warning ring-amber-200',
  out: 'bg-red-50 text-danger ring-red-200',
}

export function StatusBadge({
  status,
}: {
  status: 'healthy' | 'low' | 'out'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  )
}

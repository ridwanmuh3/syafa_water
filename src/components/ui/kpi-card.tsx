import { cn } from '~/lib/cn'
import { Icon, type IconName } from './icon'

type KpiTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral'

const tones: Record<KpiTone, string> = {
  brand: 'border-brand-100 bg-brand-50 text-brand-700',
  success: 'border-green-100 bg-green-50 text-success',
  warning: 'border-orange-100 bg-orange-50 text-warning',
  danger: 'border-red-100 bg-red-50 text-danger',
  neutral: 'border-border bg-background text-muted',
}

export function KpiCard({
  label,
  value,
  helper,
  icon,
  tone = 'brand',
  className,
}: {
  label: string
  value: string
  helper?: string
  icon?: IconName
  tone?: KpiTone
  className?: string
}) {
  return (
    <section
      className={cn(
        'rounded-card border border-border bg-surface p-5 shadow-card',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        {icon ? (
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-control border', tones[tone])}>
            <Icon name={icon} />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums text-text">{value}</p>
      {helper ? <p className="mt-2 text-sm text-muted">{helper}</p> : null}
    </section>
  )
}

import type { CSSProperties } from 'react'
import { cn } from '~/lib/cn'
import { Icon, type IconName } from './icon'

type KpiTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral'

const tones: Record<KpiTone, string> = {
  brand: '#0284c7',
  success: '#15803d',
  warning: '#b45309',
  danger: '#b91c1c',
  neutral: '#075985',
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
      className={cn('card kpi-card', className)}
      style={{ '--kpi-color': tones[tone] } as CSSProperties}
    >
      <div className="kpi-label">
        <span>{label}</span>
        {icon ? (
          <span className="kpi-icon">
            <Icon name={icon} />
          </span>
        ) : null}
      </div>
      <div className="kpi-value">{value}</div>
      {helper ? <p className="kpi-meta">{helper}</p> : null}
    </section>
  )
}

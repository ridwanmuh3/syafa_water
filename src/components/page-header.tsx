import type { ReactNode } from 'react'
import { Icon, type IconName } from './ui/icon'

export function PageHeader({
  title,
  description,
  action,
  icon,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: IconName
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        {icon ? (
          <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-card border border-brand-100 bg-brand-50 text-brand-700">
            <Icon className="h-5 w-5" name={icon} />
          </span>
        ) : null}
        <div>
          <h1 className="text-2xl font-bold text-text sm:text-[28px] sm:leading-[34px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-muted sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

import type { ReactNode } from 'react'
import type { IconName } from './ui/icon'

export function PageHeader({
  title,
  description,
  action,
  icon: _icon,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: IconName
}) {
  return (
    <header className="page-header">
      <div className="page-heading">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="page-actions">{action}</div> : null}
    </header>
  )
}

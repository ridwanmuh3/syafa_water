import { Icon, type IconName } from './ui/icon'

export function ModulePanel({
  icon,
  title,
  description,
  items,
}: {
  icon: IconName
  title: string
  description: string
  items: Array<string>
}) {
  return (
    <section className="rounded-card border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-card bg-brand-50 text-brand-700">
          <Icon className="h-5 w-5" name={icon} />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-text">{title}</h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            className="flex items-center gap-2 rounded-control border border-border bg-background px-3 py-2 text-sm font-semibold text-text"
            key={item}
          >
            <Icon className="h-3.5 w-3.5 text-brand-700" name="arrowRight" />
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}

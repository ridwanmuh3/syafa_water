import type { InputHTMLAttributes } from 'react'
import { cn } from '~/lib/cn'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'min-h-10 w-full rounded-control border border-border bg-surface px-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
        className,
      )}
      {...props}
    />
  )
}

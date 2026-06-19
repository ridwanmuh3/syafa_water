import type { ButtonHTMLAttributes } from 'react'
import { cn } from '~/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-brand-600 bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600',
  secondary:
    'border-border bg-surface text-text hover:border-brand-500 hover:text-brand-700 focus-visible:outline-brand-600',
  ghost:
    'border-transparent bg-transparent text-muted hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-brand-600',
  danger:
    'border-danger bg-danger text-white hover:bg-red-700 focus-visible:outline-danger',
}

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-control border px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

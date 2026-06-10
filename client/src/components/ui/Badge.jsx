import { cn } from '@/lib/utils'

export function Badge({ variant = 'default', className = '', children, ...props }) {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    success: 'border-transparent bg-green-900/40 text-green-400',
    warning: 'border-transparent bg-yellow-900/40 text-yellow-400',
    danger: 'border-transparent bg-destructive/20 text-destructive',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variants[variant] ?? variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

import { cn } from '@/lib/utils'

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={cn(
        'w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

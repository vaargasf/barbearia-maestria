import { Button } from './Button'

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        {children}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
        {!footer && onClose && (
          <div className="mt-6 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Fechar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

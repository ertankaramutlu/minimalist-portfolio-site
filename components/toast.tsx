'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'success' | 'error' | 'info'

type ToastProps = {
  message: string
  description?: string
  variant?: ToastVariant
  visible: boolean
  onDismiss: () => void
  duration?: number
}

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="size-5 shrink-0 text-emerald-500" />,
  error: <X className="size-5 shrink-0 text-destructive" />,
  info: <CheckCircle className="size-5 shrink-0 text-primary" />,
}

export function Toast({
  message,
  description,
  variant = 'success',
  visible,
  onDismiss,
  duration = 4500,
}: ToastProps) {
  // mounted: DOM'da var mı? (exit animasyonu için ayrı flag)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (visible) {
      setMounted(true)
    } else {
      // Çıkış animasyonu bitmeden unmount etme
      const t = setTimeout(() => setMounted(false), 400)
      return () => clearTimeout(t)
    }
  }, [visible])

  // Otomatik kapatma
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [visible, onDismiss, duration])

  if (!mounted) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-6 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 items-start gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-lg',
        'transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0',
      )}
    >
      {/* İkon */}
      {icons[variant]}

      {/* Metin */}
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{message}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Kapat */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Bildirimi kapat"
        className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

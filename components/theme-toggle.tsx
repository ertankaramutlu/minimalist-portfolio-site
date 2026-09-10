'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Hydration tamamlanana kadar render etme — ikon flaşını önler
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Layout kaymasını önlemek için aynı boyutta boş placeholder
    return <div className={cn('size-8 rounded-lg', className)} />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
      className={cn(
        'relative flex size-8 items-center justify-center rounded-lg border border-border',
        'text-muted-foreground transition-colors duration-200',
        'hover:border-foreground/20 hover:bg-muted hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      {/* Güneş — açık modda görünür */}
      <Sun
        className={cn(
          'absolute size-4 transition-all duration-300',
          isDark
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100',
        )}
        aria-hidden
      />

      {/* Ay — karanlık modda görünür */}
      <Moon
        className={cn(
          'absolute size-4 transition-all duration-300',
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0',
        )}
        aria-hidden
      />
    </button>
  )
}

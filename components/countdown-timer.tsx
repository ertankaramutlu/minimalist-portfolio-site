'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(targetDate: string): TimeLeft | null {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return null

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

type UnitProps = {
  value: string
  label: string
  className?: string
}

function Unit({ value, label, className }: UnitProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-5 py-6 sm:px-8 sm:py-8',
        className,
      )}
    >
      {/* Sayı */}
      <span
        className="font-mono text-4xl font-semibold tabular-nums leading-none tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>
      {/* Etiket */}
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

type Props = {
  targetDate: string
  eventTitle: string
  eventLocation?: string
}

export function CountdownTimer({ targetDate, eventTitle, eventLocation }: Props) {
  // null → henüz mount edilmedi (hydration uyuşmazlığını önler)
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | 'loading'>('loading')

  useEffect(() => {
    // İlk hesaplama — hemen
    setTimeLeft(calcTimeLeft(targetDate))

    const interval = setInterval(() => {
      const t = calcTimeLeft(targetDate)
      setTimeLeft(t)
      if (!t) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  /* ── Skeleton (hydration tamamlanana dek) ── */
  if (timeLeft === 'loading') {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
        <div className="mb-6 h-5 w-48 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted sm:h-36" />
          ))}
        </div>
      </div>
    )
  }

  /* ── Etkinlik geçmiş ── */
  if (!timeLeft) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">
          Bu etkinlik sona erdi
        </p>
        <p className="mt-2 text-2xl font-medium tracking-tight">{eventTitle}</p>
      </div>
    )
  }

  const units = [
    { value: pad(timeLeft.days), label: 'Gün' },
    { value: pad(timeLeft.hours), label: 'Saat' },
    { value: pad(timeLeft.minutes), label: 'Dakika' },
    { value: pad(timeLeft.seconds), label: 'Saniye' },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
      {/* Başlık alanı */}
      <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Geri Sayım
          </p>
          <h2 className="mt-1 text-xl font-medium tracking-tight sm:text-2xl">
            {eventTitle}
          </h2>
        </div>
        {eventLocation && (
          <p className="font-mono text-xs text-muted-foreground">
            📍 {eventLocation}
          </p>
        )}
      </div>

      {/* Sayaç ızgarası */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map(({ value, label }) => (
          <Unit key={label} value={value} label={label} />
        ))}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const WORDS = ['Tasarla.', 'Kurgula.', 'Yayınla.']

/**
 * Full-screen welcome animation. Cycles a few words, then wipes upward to
 * reveal the page. Locks scroll while playing and respects reduced motion.
 */
export function IntroOverlay() {
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDone(true)
      return
    }

    document.body.style.overflow = 'hidden'

    const wordTimers = WORDS.map((_, i) =>
      window.setTimeout(() => setIndex(i), i * 520),
    )
    const leaveTimer = window.setTimeout(() => setLeaving(true), WORDS.length * 520 + 260)
    const doneTimer = window.setTimeout(() => {
      setDone(true)
      document.body.style.overflow = ''
    }, WORDS.length * 520 + 260 + 900)

    return () => {
      wordTimers.forEach(clearTimeout)
      clearTimeout(leaveTimer)
      clearTimeout(doneTimer)
      document.body.style.overflow = ''
    }
  }, [])

  if (done) return null

  return (
    <div
      aria-hidden="true"
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-foreground text-background',
        'transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]',
        leaving ? '-translate-y-full' : 'translate-y-0',
      )}
    >
      <span className="absolute top-8 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.4em] text-background/50">
        Elif Demir
      </span>
      <div className="overflow-hidden">
        <span
          key={index}
          className="animate-rise block text-4xl font-medium tracking-tight sm:text-6xl"
        >
          {WORDS[index]}
        </span>
      </div>
    </div>
  )
}

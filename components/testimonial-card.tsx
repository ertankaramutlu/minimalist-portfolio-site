'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import type { Testimonial } from '@/types/sanity'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

/* ─── Kaç karakterden sonra "Devamını Oku" çıksın ─────────────────────────── */
const CLAMP_THRESHOLD = 160

/* ─── Yıldız ─────────────────────────────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} üzerinden 5 puan`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'size-3.5',
            i < rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted',
          )}
        />
      ))}
    </div>
  )
}

/* ─── Kart ────────────────────────────────────────────────────────────────── */

export function TestimonialCard({ item, index }: { item: Testimonial; index: number }) {
  const [expanded, setExpanded] = useState(false)

  const avatarUrl = item.avatar?.asset?.url
    ? urlFor(item.avatar).width(80).height(80).auto('format').url()
    : null

  const initial   = item.name.charAt(0).toUpperCase()
  const isLong    = item.comment.length > CLAMP_THRESHOLD

  return (
    <Reveal delay={(index % 3) * 80} className="h-full">
      <article className="group flex h-full flex-col gap-5 rounded-2xl border border-border bg-card p-6 cursor-default transition-all duration-300 hover:border-foreground/20 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 sm:p-7">

        {/* Üst: yıldız + dekoratif tırnak */}
        <div className="flex items-center justify-between">
          <StarRating rating={item.rating ?? 5} />
          <span
            aria-hidden
            className="select-none font-serif text-4xl leading-none text-border transition-colors group-hover:text-primary/20"
          >
            "
          </span>
        </div>

        {/* Yorum — kısa ise düz göster, uzunsa clamp + toggle */}
        <div className="flex flex-1 flex-col gap-2">
          <blockquote
            className={cn(
              'text-sm leading-relaxed text-muted-foreground sm:text-base',
              !expanded && isLong && 'line-clamp-4',
            )}
          >
            "{item.comment}"
          </blockquote>

          {/* Devamını Oku / Gizle butonu */}
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="self-start font-mono text-[0.65rem] uppercase tracking-widest text-primary transition-opacity hover:opacity-70"
            >
              {expanded ? 'Gizle ↑' : 'Devamını Oku ↓'}
            </button>
          )}
        </div>

        {/* Alt: avatar + isim + unvan */}
        <footer className="flex items-center gap-3 border-t border-border pt-5">
          {avatarUrl ? (
            <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border">
              <Image
                src={avatarUrl}
                alt={item.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary">
              <span className="font-mono text-sm font-medium text-muted-foreground">
                {initial}
              </span>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-foreground">{item.name}</p>
            {item.role && (
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {item.role}
              </p>
            )}
          </div>
        </footer>
      </article>
    </Reveal>
  )
}

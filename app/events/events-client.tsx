'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, X } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import type { Event } from '@/types/sanity'
import type { PortableTextBlock } from '@portabletext/react'
import { CountdownTimer } from '@/components/countdown-timer'
import { Reveal } from '@/components/reveal'
import { SearchFilter } from '@/components/search-filter'

/* ─── Yardımcılar ─────────────────────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** İlk paragraftan düz metin */
function extractFirstParagraph(blocks?: PortableTextBlock[]): string {
  if (!blocks?.length) return ''
  const first = blocks.find((b) => b._type === 'block')
  if (!first) return ''
  const children = (first as { children?: { text?: string }[] }).children ?? []
  return children.map((c) => c.text ?? '').join('')
}

/** Tüm bloklardan düz metin (modal için) */
function extractAllText(blocks?: PortableTextBlock[]): string {
  if (!blocks?.length) return ''
  return blocks
    .filter((b) => b._type === 'block')
    .map((b) => {
      const children = (b as { children?: { text?: string }[] }).children ?? []
      return children.map((c) => c.text ?? '').join('')
    })
    .filter(Boolean)
    .join('\n\n')
}

/* ─── Modal ───────────────────────────────────────────────────────────────── */

function EventModal({
  event,
  onClose,
}: {
  event: Event
  onClose: () => void
}) {
  const imageUrl = event.mainImage?.asset?.url
    ? urlFor(event.mainImage).width(1200).height(675).auto('format').url()
    : null

  const fullText = extractAllText(event.description)

  // Escape tuşu desteği + body scroll kilidi
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    /* Arka plan / backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Karartma katmanı */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal içeriği */}
      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kapat butonu */}
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-4 top-4 z-20 flex size-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        {/* Kaydırılabilir içerik */}
        <div className="overflow-y-auto">
          {/* Kapak görseli */}
          {imageUrl ? (
            <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-secondary">
              <Image
                src={imageUrl}
                alt={event.mainImage?.alt ?? event.title}
                fill
                sizes="(min-width: 768px) 672px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-secondary">
              <Calendar className="size-12 text-muted-foreground/20" />
            </div>
          )}

          {/* Metin alanı */}
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            {/* Durum + başlık */}
            <div>
              <span className="mb-2 block font-mono text-xs uppercase tracking-[0.25em] text-primary">
                Etkinlik Detayı
              </span>
              <h2 className="text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
                {event.title}
              </h2>
            </div>

            {/* Meta */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <Calendar className="size-3.5 shrink-0" />
                <time dateTime={event.eventDate}>
                  {formatDateTime(event.eventDate)}
                </time>
              </div>
              {event.location && (
                <div className="flex items-start gap-2 font-mono text-xs text-muted-foreground">
                  <MapPin className="mt-px size-3.5 shrink-0" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* Ayırıcı */}
            <hr className="border-border" />

            {/* Tam açıklama */}
            {fullText ? (
              <div className="flex flex-col gap-4">
                {fullText.split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Bu etkinlik için açıklama girilmemiş.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Kart ────────────────────────────────────────────────────────────────── */

function EventCard({
  event,
  index,
  onSelect,
}: {
  event: Event
  index: number
  onSelect: (e: Event) => void
}) {
  const upcoming = new Date(event.eventDate).getTime() > Date.now()
  const imageUrl = event.mainImage?.asset?.url
    ? urlFor(event.mainImage).width(700).height(394).auto('format').url()
    : null
  const excerpt = extractFirstParagraph(event.description)

  return (
    <Reveal delay={(index % 3) * 80}>
      <button
        type="button"
        onClick={() => onSelect(event)}
        className={`group flex h-full w-full flex-col overflow-hidden rounded-xl border bg-card text-left transition-colors hover:border-foreground/20 ${
          upcoming ? 'border-border' : 'border-border opacity-70'
        }`}
      >
        {/* Görsel */}
        <div className="relative aspect-video w-full overflow-hidden bg-secondary">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={event.mainImage?.alt ?? event.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="size-10 text-muted-foreground/20" />
            </div>
          )}
          {/* Durum rozeti */}
          <div className="absolute right-3 top-3">
            <span
              className={`rounded-full px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest ${
                upcoming
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {upcoming ? 'Yaklaşan' : 'Geçmiş'}
            </span>
          </div>
        </div>

        {/* İçerik */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="text-base font-medium leading-snug tracking-tight">
            {event.title}
          </h3>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <Calendar className="size-3.5 shrink-0" />
              <time dateTime={event.eventDate}>{formatDateTime(event.eventDate)}</time>
            </div>
            {event.location && (
              <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
          </div>
          {excerpt && (
            <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {excerpt}
            </p>
          )}
          {/* Detay ipucu */}
          <span className="mt-auto pt-2 font-mono text-xs uppercase tracking-widest text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Detayları Gör →
          </span>
        </div>
      </button>
    </Reveal>
  )
}

/* ─── Ana İstemci Bileşeni ────────────────────────────────────────────────── */

export type EventsClientProps = {
  upcoming: Event[]
  past: Event[]
}

function uniqueCategories(events: Event[]): string[] {
  const set = new Set<string>()
  events.forEach((e) => { if (e.category) set.add(e.category) })
  return Array.from(set).sort()
}

function eventMatchesQuery(event: Event, q: string): boolean {
  const lower = q.toLowerCase()
  return (
    event.title.toLowerCase().includes(lower) ||
    (event.location ?? '').toLowerCase().includes(lower) ||
    (event.category ?? '').toLowerCase().includes(lower)
  )
}

export function EventsClient({ upcoming, past }: EventsClientProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const closeModal = useCallback(() => setSelectedEvent(null), [])

  const nextEvent = upcoming[0] ?? null
  const otherUpcoming = upcoming.slice(1)
  // Diğer kart listesi: geri kalan yaklaşan + geçmişler
  const cardEvents = [...otherUpcoming, ...past]

  const cardCategories = useMemo(() => uniqueCategories(cardEvents), [cardEvents])

  const hasCards = cardEvents.length > 0
  const hasAny = upcoming.length > 0 || past.length > 0

  return (
    <>
      {!hasAny ? (
        /* ── Boş durum ── */
        <Reveal>
          <div className="flex flex-col items-center gap-4 py-32 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Henüz etkinlik yok
            </span>
            <p className="text-muted-foreground">
              Sanity Studio'dan ilk etkinliğini ekleyebilirsin.
            </p>
            <Link
              href="/studio"
              className="mt-4 font-mono text-xs uppercase tracking-widest text-primary underline underline-offset-4"
            >
              Studio'ya git →
            </Link>
          </div>
        </Reveal>
      ) : (
        <>
          {/* ════════════════════════════════════════════════
              Öne Çıkan Etkinlik + Geri Sayım
              Safari-safe: grid + min-w-0 + w-full
          ════════════════════════════════════════════════ */}
          {nextEvent && (
            <Reveal className="mb-20">
              <div className="grid w-full grid-cols-1 items-stretch gap-8 lg:grid-cols-2">

                {/* Sol: Geri Sayım + Meta */}
                <div className="flex min-w-0 flex-col gap-5">
                  <CountdownTimer
                    targetDate={nextEvent.eventDate}
                    eventTitle={nextEvent.title}
                    eventLocation={nextEvent.location}
                  />
                  <div className="flex flex-wrap gap-4 pl-1">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <Calendar className="size-3.5 shrink-0" />
                      <time dateTime={nextEvent.eventDate}>
                        {formatDateTime(nextEvent.eventDate)}
                      </time>
                    </div>
                    {nextEvent.location && (
                      <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" />
                        <span>{nextEvent.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sağ: Görsel + Başlık + Açıklama */}
                <div className="flex min-w-0 flex-col gap-5">
                  {nextEvent.mainImage?.asset?.url ? (
                    <div className="relative aspect-video max-h-80 w-full overflow-hidden rounded-xl border border-border bg-secondary">
                      <Image
                        src={urlFor(nextEvent.mainImage)
                          .width(800)
                          .height(450)
                          .auto('format')
                          .url()}
                        alt={nextEvent.mainImage.alt ?? nextEvent.title}
                        fill
                        priority
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute left-3 top-3 rounded-full border border-border bg-background/80 px-3 py-1 backdrop-blur-sm">
                        <time
                          dateTime={nextEvent.eventDate}
                          className="font-mono text-[0.6rem] uppercase tracking-widest text-foreground"
                        >
                          {formatDate(nextEvent.eventDate)}
                        </time>
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-video max-h-80 w-full items-center justify-center rounded-xl border border-border bg-secondary">
                      <Calendar className="size-10 text-muted-foreground/30" />
                    </div>
                  )}

                  <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
                    {nextEvent.title}
                  </h2>

                  {nextEvent.description && nextEvent.description.length > 0 && (
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {extractFirstParagraph(nextEvent.description)}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedEvent(nextEvent)}
                    className="mt-auto self-start font-mono text-xs uppercase tracking-widest text-primary transition-opacity hover:opacity-70"
                  >
                    Detayları Gör →
                  </button>
                </div>
              </div>
            </Reveal>
          )}

          {/* ── Diğer etkinlikler (arama + filtre) ── */}
          {hasCards && (
            <>
              <Reveal className="mb-8 border-t border-border pt-16">
                <span className="font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
                  {nextEvent ? 'Diğer Etkinlikler' : 'Tüm Etkinlikler'}
                </span>
              </Reveal>

              <SearchFilter
                items={cardEvents}
                categories={cardCategories}
                searchFn={eventMatchesQuery}
                getCategory={(e) => e.category}
                placeholder="Etkinlik, konum veya kategori ara…"
              >
                {(filtered) => (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((event, i) => (
                      <EventCard
                        key={event._id}
                        event={event}
                        index={i}
                        onSelect={setSelectedEvent}
                      />
                    ))}
                  </div>
                )}
              </SearchFilter>
            </>
          )}
        </>
      )}

      {/* ── Modal ── */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={closeModal} />
      )}
    </>
  )
}

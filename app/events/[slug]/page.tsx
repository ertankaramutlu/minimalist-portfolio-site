import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Calendar } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { eventBySlugQuery, eventSlugsQuery } from '@/sanity/lib/queries'
import { urlFor, urlForOpenGraph } from '@/sanity/lib/image'
import type { Event } from '@/types/sanity'
import { SiteNav } from '@/components/site-nav'
import { SitePortableText } from '@/components/portable-text'

const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const SITE_NAME = 'Elif Demir'

/* ─── Statik parametreler ─────────────────────────────────────────────── */

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(eventSlugsQuery)
  return slugs.map((slug) => ({ slug }))
}

/* ─── Metadata ────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event: Event | null = await client.fetch(eventBySlugQuery, { slug })

  if (!event) return {}

  const ogImageUrl  = urlForOpenGraph(event.mainImage)
  const pageUrl     = `${SITE_URL}/events/${slug}`
  const description = `${formatDateTime(event.eventDate)}${event.location ? ` · ${event.location}` : ''}`
  const images      = ogImageUrl
    ? [{ url: ogImageUrl, width: 1200, height: 630, alt: event.title }]
    : []

  return {
    title:       event.title,
    description,
    openGraph: {
      type:     'article',
      url:      pageUrl,
      siteName: SITE_NAME,
      title:    event.title,
      description,
      images,
    },
    twitter: {
      card:        'summary_large_image',
      title:       event.title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export const revalidate = 60

/* ─── Yardımcılar ─────────────────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/* ─── Sayfa ───────────────────────────────────────────────────────────── */

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event: Event | null = await client.fetch(eventBySlugQuery, { slug })

  if (!event) notFound()

  const coverUrl = event.mainImage?.asset?.url
    ? urlFor(event.mainImage).width(1600).height(900).auto('format').url()
    : null

  const isPast = new Date(event.eventDate).getTime() < Date.now()

  return (
    <>
      <SiteNav />

      <main className="pb-32 pt-28">
        {/* ── Geri bağlantısı ── */}
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/events"
            className="group mb-12 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Tüm Etkinliklere Dön
          </Link>
        </div>

        {/* ── Kapak görseli ── */}
        {coverUrl && (
          <div className="mx-auto mb-12 max-w-5xl px-6">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-secondary">
              <Image
                src={coverUrl}
                alt={event.mainImage?.alt ?? event.title}
                fill
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
              {/* Durum rozeti */}
              <div className="absolute left-4 top-4">
                <span className={`rounded-full px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest ${
                  isPast
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}>
                  {isPast ? 'Geçmiş Etkinlik' : 'Yaklaşan Etkinlik'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── İçerik ── */}
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 border-b border-border pb-10">
            {/* Kategori + tarih */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {event.category && (
                <span className="rounded-full border border-border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  {event.category}
                </span>
              )}
              <time
                dateTime={event.eventDate}
                className="font-mono text-xs uppercase tracking-[0.35em] text-primary"
              >
                {formatDate(event.eventDate)}
              </time>
            </div>

            <h1 className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {event.title}
            </h1>

            {/* Meta bilgiler */}
            <div className="mt-6 flex flex-wrap gap-5">
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <Calendar className="size-3.5 shrink-0" />
                <time dateTime={event.eventDate}>{formatDateTime(event.eventDate)}</time>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Açıklama (Portable Text) ── */}
          {event.description && event.description.length > 0 ? (
            <article>
              <SitePortableText value={event.description} />
            </article>
          ) : (
            <p className="text-muted-foreground">Bu etkinlik için açıklama eklenmemiş.</p>
          )}

          {/* ── Geri bağlantısı – alt ── */}
          <div className="mt-16 border-t border-border pt-10">
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
              Tüm Etkinliklere Dön
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

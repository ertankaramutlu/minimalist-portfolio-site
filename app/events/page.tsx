import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { upcomingEventsQuery, pastEventsQuery } from '@/sanity/lib/queries'
import type { Event } from '@/types/sanity'
import { EventsClient } from './events-client'
import { Reveal } from '@/components/reveal'
import { SiteNav } from '@/components/site-nav'

export const metadata: Metadata = {
  title: 'Etkinlikler — Elif Demir',
  description: 'Yaklaşan ve geçmiş etkinlikler, workshoplar ve konuşmalar.',
}

export const revalidate = 60

export default async function EventsPage() {
  // Paralel fetch — en yakından uzağa / en yeniden eskiye
  const [upcoming, past] = await Promise.all([
    client.fetch<Event[]>(upcomingEventsQuery),
    client.fetch<Event[]>(pastEventsQuery),
  ])

  return (
    <>
      <SiteNav />

      <main className="pb-32 pt-32">
        <div className="mx-auto max-w-6xl px-6">

          {/* Başlık — Server Component'te kalır (SEO için) */}
          <Reveal className="mb-16 border-b border-border pb-10">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.35em] text-primary">
              Etkinlikler
            </span>
            <h1 className="text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl">
              Nerede olacağım<span className="text-primary">.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Yaklaşan workshoplar, konuşmalar ve buluşmalar.
            </p>
          </Reveal>

          {/* İnteraktif kısım — Client Component */}
          <EventsClient upcoming={upcoming} past={past} />
        </div>
      </main>
    </>
  )
}

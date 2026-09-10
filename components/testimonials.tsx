import { Star } from 'lucide-react'
import { client } from '@/sanity/lib/client'
import { testimonialsQuery } from '@/sanity/lib/queries'
import type { Testimonial } from '@/types/sanity'
import { Reveal } from '@/components/reveal'
import { TestimonialsSwiper } from '@/components/testimonials-swiper'

/* ─── Ana Bileşen (Server Component) ─────────────────────────────────────── */

export async function Testimonials() {
  const items: Testimonial[] = await client.fetch(testimonialsQuery)

  if (!items.length) return null

  return (
    <section className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">

        {/* Başlık */}
        <Reveal className="mb-16">
          <Reveal
            as="span"
            className="mb-4 block font-mono text-xs uppercase tracking-[0.35em] text-primary"
          >
            Müşteri Yorumları
          </Reveal>
          <h2 className="max-w-2xl text-4xl font-medium tracking-tight sm:text-5xl">
            Birlikte çalıştığımız kişiler ne diyor<span className="text-primary">.</span>
          </h2>
        </Reveal>

        {/* Swiper kaydırıcı */}
        <TestimonialsSwiper items={items} />

        {/* Genel puan özeti */}
        {items.length >= 3 && (
          <Reveal className="mt-12 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {items.length}+ müşteriden 5/5 puan
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}

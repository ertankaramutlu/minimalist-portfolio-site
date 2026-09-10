'use client'

import { useState, useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/pagination'

import type { Testimonial } from '@/types/sanity'
import { TestimonialCard } from '@/components/testimonial-card'
import { cn } from '@/lib/utils'

export function TestimonialsSwiper({ items }: { items: Testimonial[] }) {
  const [swiper, setSwiper]           = useState<SwiperType | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd]             = useState(false)

  const handleSwiper = useCallback((s: SwiperType) => {
    setSwiper(s)
    setIsBeginning(s.isBeginning)
    setIsEnd(s.isEnd)
  }, [])

  const handleSlideChange = useCallback((s: SwiperType) => {
    setIsBeginning(s.isBeginning)
    setIsEnd(s.isEnd)
  }, [])

  const prev = () => swiper?.slidePrev()
  const next = () => swiper?.slideNext()

  const btnBase = cn(
    'relative z-20 flex size-9 cursor-pointer items-center justify-center',
    'rounded-lg border border-border bg-background/90 backdrop-blur-sm',
    'text-muted-foreground transition-all duration-200',
    'hover:border-foreground/30 hover:text-foreground hover:shadow-sm',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  )
  const disabledCls = 'opacity-30 pointer-events-none'

  return (
    <div className="testimonials-swiper relative">

      {/* ── Özel Navigasyon Butonları (üst-sağ) ── */}
      <div className="absolute right-0 top-0 z-20 flex items-center gap-2">
        <button
          type="button"
          aria-label="Önceki yorum"
          onClick={prev}
          disabled={isBeginning}
          className={cn(btnBase, isBeginning && disabledCls)}
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Sonraki yorum"
          onClick={next}
          disabled={isEnd}
          className={cn(btnBase, isEnd && disabledCls)}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* ── Swiper ── */}
      <Swiper
        modules={[Pagination, Autoplay]}
        onSwiper={handleSwiper}
        onSlideChange={handleSlideChange}
        a11y={{ enabled: false }}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        touchEventsTarget="container"
        breakpoints={{
          640:  { slidesPerView: 1.2, spaceBetween: 24 },
          768:  { slidesPerView: 2,   spaceBetween: 28 },
          1024: { slidesPerView: 3,   spaceBetween: 32 },
        }}
        style={{ paddingBottom: '52px', paddingTop: '52px' }}
      >
        {items.map((item, i) => (
          <SwiperSlide key={item._id} style={{ height: 'auto' }}>
            <div className="h-full pb-1">
              <TestimonialCard item={item} index={i} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── CSS overrides ── */}
      <style>{`
        .testimonials-swiper {
          --swiper-pagination-color:                  hsl(var(--primary));
          --swiper-pagination-bullet-inactive-color:  hsl(var(--border));
          --swiper-pagination-bullet-inactive-opacity: 1;
          --swiper-pagination-bullet-size:            7px;
          --swiper-pagination-bullet-horizontal-gap:  4px;
        }

        .testimonials-swiper .swiper-pagination { bottom: 10px; }
        .testimonials-swiper .swiper-wrapper    { align-items: stretch; }
        .testimonials-swiper .swiper-slide      { height: auto !important; }

        /* İmleç: slider üzerinde varsayılan ok, sadece pagination noktaları el */
        .testimonials-swiper .swiper-container,
        .testimonials-swiper .swiper             { cursor: default !important; }
        .testimonials-swiper .swiper-pagination-bullet { cursor: pointer; }
      `}</style>
    </div>
  )
}

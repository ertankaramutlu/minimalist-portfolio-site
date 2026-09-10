'use client'

import { useId, useState } from 'react'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

const ITEMS = [
  {
    question: 'Yeni bir projeye nasıl başlıyorsun?',
    answer:
      'Kısa bir keşif görüşmesiyle başlıyorum: hedef, kısıtlar ve başarı ölçütleri. Ardından kapsamı netleştirip düşük sadakatli akışlarla ilerliyor, onaylandıktan sonra arayüz ve prototipe geçiyorum.',
  },
  {
    question: 'Sadece tasarım mı, yoksa geliştirme de yapıyor musun?',
    answer:
      'İkisini birlikte yürütüyorum. Ürün tasarımı, tasarım sistemleri ve React / Next.js ile erişilebilir arayüz üretimi aynı süreçte ilerleyebilir; ihtiyaca göre yalnızca bir katmanda da çalışırım.',
  },
  {
    question: 'Bir projenin ortalama süresi nedir?',
    answer:
      'Landing veya marka sitesi genelde 2–4 hafta, ürün arayüzü veya tasarım sistemi 6–12 hafta civarında. Süre, kapsamın netliği ve geri bildirim ritmine göre şekillenir.',
  },
  {
    question: 'Uzaktan çalışıyor musun ve nasıl iletişime geçilir?',
    answer:
      'Evet, İstanbul merkezli olarak uzaktan çalışıyorum. Kısa bir e-posta yeterli: merhaba@elifdemir.com adresine projenin özeti ve zaman çizelgesini yazman yeterli.',
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section id="faq" className="border-t border-border px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal
          as="span"
          className="mb-16 block font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground"
        >
          03 — Sıkça Sorulan Sorular
        </Reveal>

        <Reveal>
          <h2 className="max-w-3xl text-balance text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
            Çalışma şeklim hakkında en çok sorulanlar.
          </h2>
        </Reveal>

        <div className="mt-16 overflow-hidden rounded-lg border border-border">
          {ITEMS.map((item, i) => {
            const isOpen = openIndex === i
            const panelId = `${baseId}-panel-${i}`
            const buttonId = `${baseId}-button-${i}`

            return (
              <Reveal
                key={item.question}
                delay={i * 60}
                className={cn(i > 0 && 'border-t border-border')}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 bg-background px-6 py-5 text-left transition-colors hover:bg-secondary sm:px-8 sm:py-6"
                  >
                    <span className="flex min-w-0 items-baseline gap-4">
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        0{i + 1}
                      </span>
                      <span className="text-base font-medium tracking-tight sm:text-lg">
                        {item.question}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border font-mono text-sm text-muted-foreground"
                    >
                      <span
                        className={cn(
                          'absolute h-px w-2.5 bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                          isOpen && 'rotate-180',
                        )}
                      />
                      <span
                        className={cn(
                          'absolute h-2.5 w-px bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                          isOpen && 'rotate-90 scale-y-0',
                        )}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-pretty leading-relaxed text-muted-foreground sm:px-8 sm:pl-[4.25rem] sm:pb-7">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'

const HEADLINE = ['Sade,', 'amacına', 'hizmet eden', 'ürünler.']

export function Hero() {
  // Small parallax on the scroll hint / meta row as the user starts scrolling.
  const [y, setY] = useState(0)
  useEffect(() => {
    const onScroll = () => setY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-between px-6 pb-10 pt-32 sm:pt-40"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center">
        <span
          className="animate-rise mb-8 block font-mono text-xs uppercase tracking-[0.35em] text-primary"
          style={{ animationDelay: '80ms' }}
        >
          Ürün Tasarımcısı & Geliştirici
        </span>

        <h1 className="max-w-4xl text-balance text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
          {HEADLINE.map((word, i) => (
            <span
              key={word}
              className="mr-[0.25em] inline-block overflow-hidden align-bottom"
            >
              <span
                className="animate-rise inline-block"
                style={{ animationDelay: `${180 + i * 90}ms` }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="animate-rise mt-8 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          style={{ animationDelay: '640ms' }}
        >
          Ben Elif. Beş yıldır fikirleri; net, erişilebilir ve iyi
          çalışan dijital deneyimlere dönüştürüyorum.
        </p>
      </div>

      <div
        className="mx-auto flex w-full max-w-6xl items-end justify-between border-t border-border pt-6"
        style={{ transform: `translateY(${Math.min(y * 0.06, 24)}px)` }}
      >
        <div className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground sm:block">
          İstanbul, TR — {new Date().getFullYear()}
        </div>
        <a
          href="#work"
          className="group flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>Aşağı kaydır</span>
          <span className="relative flex h-8 w-5 items-start justify-center rounded-full border border-current p-1">
            <span className="h-2 w-0.5 animate-bounce rounded-full bg-current" />
          </span>
        </a>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'

export default function NotFound() {
  return (
    <>
      <SiteNav />

      <main className="flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-32">
        {/* Büyük 404 */}
        <p
          aria-hidden
          className="select-none font-mono text-[20vw] font-semibold leading-none tracking-tight text-muted/40 sm:text-[12rem]"
        >
          404
        </p>

        {/* Metin */}
        <div className="-mt-4 flex flex-col items-center gap-4 text-center sm:-mt-8">
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
            Sayfa bulunamadı
          </span>
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Aradığınız sayfa mevcut değil<span className="text-primary">.</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Sayfa kaldırılmış, taşınmış ya da hiç var olmamış olabilir.
            URL'yi kontrol edin veya ana sayfaya dönün.
          </p>
        </div>

        {/* Butonlar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-lg bg-primary px-6 font-mono text-sm font-medium uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-80"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/blog"
            className="inline-flex h-11 items-center rounded-lg border border-border px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            Blog'a Git
          </Link>
        </div>

        {/* Dekoratif çizgi */}
        <div className="mt-20 h-px w-24 bg-border" />
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Elif Demir
        </p>
      </main>
    </>
  )
}

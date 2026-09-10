'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Tipler ──────────────────────────────────────────────────────────────── */

export type SearchFilterProps<T> = {
  /** Ham veri listesi */
  items: T[]
  /** Tüm benzersiz kategoriler */
  categories: string[]
  /** Arama metni ve öğeyi karşılaştıran fonksiyon */
  searchFn: (item: T, query: string) => boolean
  /** Her öğenin kategorisini döndüren fonksiyon */
  getCategory: (item: T) => string | undefined
  /** Filtrelenmiş listeyi render eden render-prop */
  children: (filtered: T[]) => React.ReactNode
  /** Input placeholder */
  placeholder?: string
}

/* ─── Sabitler ────────────────────────────────────────────────────────────── */

const ALL = 'Tümü'

/* ─── Bileşen ─────────────────────────────────────────────────────────────── */

export function SearchFilter<T>({
  items,
  categories,
  searchFn,
  getCategory,
  children,
  placeholder = 'Ara…',
}: SearchFilterProps<T>) {
  const [query, setQuery]       = useState('')
  const [active, setActive]     = useState(ALL)

  const filtered = useMemo(() => {
    let result = items

    // Kategori filtresi
    if (active !== ALL) {
      result = result.filter((item) => getCategory(item) === active)
    }

    // Metin arama
    const q = query.trim()
    if (q) {
      result = result.filter((item) => searchFn(item, q))
    }

    return result
  }, [items, active, query, searchFn, getCategory])

  const allCategories = [ALL, ...categories]

  return (
    <div className="flex flex-col gap-8">
      {/* ── Arama + Filtre satırı ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">

        {/* Arama Girdisi */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'h-10 w-full rounded-lg border border-border bg-background pl-10 pr-10',
              'text-sm text-foreground placeholder:text-muted-foreground',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0',
            )}
          />
          {query && (
            <button
              type="button"
              aria-label="Aramayı temizle"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Kategori Pill'leri */}
        {categories.length > 0 && (
          <div
            role="group"
            aria-label="Kategori filtresi"
            className="flex flex-wrap gap-2"
          >
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest',
                  'transition-all duration-200',
                  active === cat
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Sonuçlar ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-28 text-center">
          <Search className="size-8 text-muted-foreground/30" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Sonuç bulunamadı
          </p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Aradığınız kriterlere uygun içerik bulunamadı. Farklı bir arama
            terimi veya kategori deneyin.
          </p>
          <button
            type="button"
            onClick={() => { setQuery(''); setActive(ALL) }}
            className="mt-2 font-mono text-xs uppercase tracking-widest text-primary transition-opacity hover:opacity-70"
          >
            Filtreyi temizle
          </button>
        </div>
      ) : (
        children(filtered)
      )}
    </div>
  )
}

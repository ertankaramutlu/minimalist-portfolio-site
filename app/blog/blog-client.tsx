'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { urlFor } from '@/sanity/lib/image'
import type { Post } from '@/types/sanity'
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

function uniqueCategories(posts: Post[]): string[] {
  const set = new Set<string>()
  posts.forEach((p) => { if (p.category) set.add(p.category) })
  return Array.from(set).sort()
}

/* ─── Arama fonksiyonu ────────────────────────────────────────────────────── */

function postMatchesQuery(post: Post, q: string): boolean {
  const lower = q.toLowerCase()
  return (
    post.title.toLowerCase().includes(lower) ||
    (post.excerpt ?? '').toLowerCase().includes(lower) ||
    (post.category ?? '').toLowerCase().includes(lower)
  )
}

/* ─── Kart bileşeni ─────────────────────────────────────────────────────── */

function PostCard({ post, index }: { post: Post; index: number }) {
  const imageUrl = post.image
    ? urlFor(post.image).width(800).height(500).auto('format').url()
    : null

  return (
    <Reveal delay={(index % 3) * 80}>
      <Link href={`/blog/${post.slug.current}`} className="group block h-full">
        {/* Görsel */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-secondary">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.image?.alt ?? post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="select-none font-mono text-4xl text-muted-foreground/20">
                {post.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Kategori rozeti */}
          {post.category && (
            <div className="absolute left-3 top-3">
              <span className="rounded-full border border-border bg-background/80 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-foreground backdrop-blur-sm">
                {post.category}
              </span>
            </div>
          )}
        </div>

        {/* Bilgiler */}
        <div className="mt-5 flex flex-col gap-2">
          {post.publishedAt && (
            <time
              dateTime={post.publishedAt}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
            >
              {formatDate(post.publishedAt)}
            </time>
          )}

          <h2 className="text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
            {post.title}
            <span className="ml-1.5 inline-block text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              →
            </span>
          </h2>

          {post.excerpt && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}

          <span className="mt-2 inline-block font-mono text-xs uppercase tracking-widest text-primary transition-opacity group-hover:opacity-70">
            Devamını Oku
          </span>
        </div>
      </Link>
    </Reveal>
  )
}

/* ─── Ana bileşen ─────────────────────────────────────────────────────────── */

export function BlogClient({ posts }: { posts: Post[] }) {
  const categories = useMemo(() => uniqueCategories(posts), [posts])

  if (posts.length === 0) {
    return (
      <Reveal>
        <div className="flex flex-col items-center gap-4 py-32 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Henüz yazı yok
          </span>
          <p className="text-muted-foreground">
            Sanity Studio'dan ilk yazını ekleyebilirsin.
          </p>
          <Link
            href="/studio"
            className="mt-4 font-mono text-xs uppercase tracking-widest text-primary underline underline-offset-4"
          >
            Studio'ya git →
          </Link>
        </div>
      </Reveal>
    )
  }

  return (
    <SearchFilter
      items={posts}
      categories={categories}
      searchFn={postMatchesQuery}
      getCategory={(p) => p.category}
      placeholder="Başlık veya kategori ara…"
    >
      {(filtered) => (
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <PostCard key={post._id} post={post} index={i} />
          ))}
        </div>
      )}
    </SearchFilter>
  )
}

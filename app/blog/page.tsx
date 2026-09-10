import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { postsQuery } from '@/sanity/lib/queries'
import type { Post } from '@/types/sanity'
import { Reveal } from '@/components/reveal'
import { SiteNav } from '@/components/site-nav'
import { BlogClient } from './blog-client'

export const metadata: Metadata = {
  title: 'Blog — Elif Demir',
  description: 'Tasarım, geliştirme ve dijital ürünler üzerine düşünceler.',
}

export const revalidate = 60

export default async function BlogPage() {
  const posts: Post[] = await client.fetch(postsQuery)

  return (
    <>
      <SiteNav />

      <main className="pb-24 pt-32">
        <div className="mx-auto max-w-6xl px-6">

          {/* Başlık */}
          <Reveal className="mb-16 border-b border-border pb-10">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.35em] text-primary">
              Blog
            </span>
            <h1 className="text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl">
              Düşünceler<span className="text-primary">.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tasarım, geliştirme ve dijital ürünler üzerine notlar.
            </p>
          </Reveal>

          {/* Arama + Filtre + Kartlar */}
          <BlogClient posts={posts} />
        </div>
      </main>
    </>
  )
}

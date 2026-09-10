import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { postBySlugQuery, postSlugsQuery } from '@/sanity/lib/queries'
import { urlFor, urlForOpenGraph } from '@/sanity/lib/image'
import type { PostDetail } from '@/types/sanity'
import { SitePortableText } from '@/components/portable-text'
import { SiteNav } from '@/components/site-nav'

const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const SITE_NAME = 'Elif Demir'

/* ─── Statik parametreler ─────────────────────────────────────────────── */

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(postSlugsQuery)
  return slugs.map((slug) => ({ slug }))
}

/* ─── Metadata ────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post: PostDetail | null = await client.fetch(postBySlugQuery, { slug })

  if (!post) return {}

  const ogImageUrl = urlForOpenGraph(post.image)
  const pageUrl    = `${SITE_URL}/blog/${slug}`
  const images     = ogImageUrl
    ? [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }]
    : []

  return {
    title:       post.title,
    description: post.excerpt,
    openGraph: {
      type:        'article',
      url:         pageUrl,
      siteName:    SITE_NAME,
      title:       post.title,
      description: post.excerpt,
      images,
      publishedTime: post.publishedAt,
    },
    twitter: {
      card:        'summary_large_image',
      title:       post.title,
      description: post.excerpt,
      images:      ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export const revalidate = 60

/* ─── Yardımcı ────────────────────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* ─── Sayfa ───────────────────────────────────────────────────────────── */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post: PostDetail | null = await client.fetch(postBySlugQuery, { slug })

  if (!post) notFound()

  const coverUrl = post.image
    ? urlFor(post.image).width(1600).height(900).auto('format').url()
    : null

  return (
    <>
      <SiteNav />

      <main className="pb-32 pt-28">
        {/* ── Geri bağlantısı – üst ── */}
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/blog"
            className="group mb-12 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            Tüm Blog Yazılarına Dön
          </Link>
        </div>

        {/* ── Kapak görseli ── */}
        {coverUrl && (
          <div className="mx-auto mb-12 max-w-5xl px-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-secondary">
              <Image
                src={coverUrl}
                alt={post.image?.alt ?? post.title}
                fill
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* ── Başlık bloğu ── */}
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 border-b border-border pb-10">
            {post.publishedAt && (
              <time
                dateTime={post.publishedAt}
                className="mb-4 block font-mono text-xs uppercase tracking-[0.35em] text-primary"
              >
                {formatDate(post.publishedAt)}
              </time>
            )}
            <h1 className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* ── Zengin metin içeriği ── */}
          {post.content && post.content.length > 0 ? (
            <article>
              <SitePortableText value={post.content} />
            </article>
          ) : (
            <p className="text-muted-foreground">
              İçerik henüz eklenmemiş.
            </p>
          )}

          {/* ── Geri bağlantısı – alt ── */}
          <div className="mt-16 border-t border-border pt-10">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              Tüm Blog Yazılarına Dön
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

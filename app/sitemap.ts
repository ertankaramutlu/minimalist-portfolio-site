import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { postSlugsQuery, eventSlugsQuery } from '@/sanity/lib/queries'

const BASE_URL = 'https://minimalist-portfolio-site-six.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* ── Dinamik slug'ları paralel çek ─────────────────────────────────────── */
  const [postSlugs, eventSlugs] = await Promise.all([
    client.fetch<string[]>(postSlugsQuery),
    client.fetch<string[]>(eventSlugsQuery),
  ])

  const now = new Date()

  /* ── Sabit rotalar ──────────────────────────────────────────────────────── */
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url:             `${BASE_URL}/`,
      lastModified:    now,
      changeFrequency: 'weekly',
      priority:        1.0,
    },
    {
      url:             `${BASE_URL}/blog`,
      lastModified:    now,
      changeFrequency: 'daily',
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/events`,
      lastModified:    now,
      changeFrequency: 'daily',
      priority:        0.8,
    },
    {
      url:             `${BASE_URL}/rezervasyon`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.7,
    },
  ]

  /* ── Dinamik blog rotaları ──────────────────────────────────────────────── */
  const postRoutes: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url:             `${BASE_URL}/blog/${slug}`,
    lastModified:    now,
    changeFrequency: 'weekly',
    priority:        0.7,
  }))

  /* ── Dinamik etkinlik rotaları ──────────────────────────────────────────── */
  const eventRoutes: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url:             `${BASE_URL}/events/${slug}`,
    lastModified:    now,
    changeFrequency: 'weekly',
    priority:        0.6,
  }))

  return [...staticRoutes, ...postRoutes, ...eventRoutes]
}

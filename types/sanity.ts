import type { PortableTextBlock } from '@portabletext/react'

/* ─── Ortak ──────────────────────────────────────────────────────────────── */

export type SanityImage = {
  asset: { _id: string; url: string }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
}

/* ─── Blog ───────────────────────────────────────────────────────────────── */

export type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  category?: string
  publishedAt: string
  image?: SanityImage
}

export type PostDetail = Post & {
  content?: PortableTextBlock[]
}

/* ─── Etkinlik ───────────────────────────────────────────────────────────── */

export type Event = {
  _id: string
  title: string
  slug: { current: string }
  eventDate: string
  location?: string
  category?: string
  mainImage?: SanityImage
  description?: PortableTextBlock[]
}

/* ─── Müşteri Yorumu ─────────────────────────────────────────────────────── */

export type Testimonial = {
  _id: string
  name: string
  role?: string
  comment: string
  rating: number
  avatar?: SanityImage
}

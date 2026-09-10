import { groq } from 'next-sanity'

/* ─── Blog Sorguları ─────────────────────────────────────────────────────── */

export const postsQuery = groq`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  category,
  publishedAt,
  "image": image {
    asset->{ _id, url },
    hotspot,
    crop,
    alt
  }
}`

export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)][].slug.current`

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "image": image {
    asset->{ _id, url },
    hotspot,
    crop,
    alt
  },
  content
}`

/* ─── Etkinlik Sorguları ─────────────────────────────────────────────────── */

const eventFields = groq`
  _id,
  title,
  slug,
  eventDate,
  location,
  category,
  description,
  "mainImage": mainImage {
    asset->{ _id, url },
    hotspot,
    crop,
    alt
  }
`

// Yaklaşan etkinlikler — en yakın tarihten uzağa
export const upcomingEventsQuery = groq`*[_type == "event" && eventDate >= now()] | order(eventDate asc) {
  ${eventFields}
}`

// Geçmiş etkinlikler — en yeni bitenden en eskiye
export const pastEventsQuery = groq`*[_type == "event" && eventDate < now()] | order(eventDate desc) {
  ${eventFields}
}`

// Tüm etkinlikler (geriye dönük uyumluluk)
export const allEventsQuery = groq`*[_type == "event"] | order(eventDate asc) {
  ${eventFields}
}`

// Slug listesi (generateStaticParams için)
export const eventSlugsQuery = groq`*[_type == "event" && defined(slug.current)][].slug.current`

// Tekil etkinlik — slug ile
export const eventBySlugQuery = groq`*[_type == "event" && slug.current == $slug][0] {
  ${eventFields}
}`

/* ─── Müşteri Yorumları ──────────────────────────────────────────────────── */

export const testimonialsQuery = groq`*[_type == "testimonial"] | order(order asc, _createdAt asc) {
  _id,
  name,
  role,
  comment,
  rating,
  "avatar": avatar {
    asset->{ _id, url },
    hotspot,
    crop
  }
}`

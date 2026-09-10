/**
 * POST /api/revalidate
 *
 * Sanity webhook'u tarafından tetiklenir.
 * İçerik güncellendiğinde ilgili sayfa önbelleklerini (ISR) sıfırlar.
 *
 * Sanity.io/manage → API → Webhooks:
 *   URL    : https://elifdemir.com/api/revalidate
 *   Trigger: Create, Update, Delete
 *   Filter : _type in ["post", "event", "testimonial"]
 *   Secret : SANITY_REVALIDATE_SECRET değerin
 */

import { type NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

/* ─── Tip ─────────────────────────────────────────────────────────────────── */

type WebhookBody = {
  _type?: string
  slug?:  { current?: string } | string
}

/* ─── Yardımcı: slug string'e dönüştür ───────────────────────────────────── */

function resolveSlug(raw: WebhookBody['slug']): string | null {
  if (!raw) return null
  if (typeof raw === 'string') return raw
  return raw.current ?? null
}

/* ─── POST Handler ────────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET

  if (!secret) {
    console.error('[revalidate] SANITY_REVALIDATE_SECRET tanımlı değil.')
    return NextResponse.json({ message: 'Sunucu yapılandırma hatası.' }, { status: 500 })
  }

  /* 1 ── Gövdeyi text olarak oku (imza doğrulaması ham string üzerinden yapılır) */
  let rawBody: string
  try {
    rawBody = await req.text()
  } catch {
    return NextResponse.json({ message: 'Bad request.' }, { status: 400 })
  }

  /* 2 ── Sanity imza doğrulaması */
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) ?? ''
  const valid     = await isValidSignature(rawBody, signature, secret)

  if (!valid) {
    console.warn('[revalidate] Geçersiz webhook imzası.')
    return NextResponse.json({ message: 'Invalid signature.' }, { status: 401 })
  }

  /* 3 ── JSON parse */
  let body: WebhookBody
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ message: 'Geçersiz JSON gövdesi.' }, { status: 400 })
  }

  const { _type } = body
  const slug      = resolveSlug(body.slug)

  /* 4 ── Tür bazlı önbellek temizleme */
  const revalidated: string[] = []

  const touch = (path: string) => {
    revalidatePath(path)
    revalidated.push(path)
  }

  if (_type === 'post') {
    touch('/')
    touch('/blog')
    if (slug) touch(`/blog/${slug}`)
  } else if (_type === 'event') {
    touch('/')
    touch('/events')
    if (slug) touch(`/events/${slug}`)
  } else if (_type === 'testimonial') {
    touch('/')
  } else if (_type) {
    touch('/')
  }

  console.info('[revalidate] Temizlendi:', revalidated)

  return NextResponse.json({
    status:      200,
    revalidated: true,
    paths:       revalidated,
    now:         Date.now(),
  })
}

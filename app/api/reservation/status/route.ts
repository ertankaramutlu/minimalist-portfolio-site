/**
 * POST /api/reservation/status
 *
 * İki kullanım senaryosu:
 *
 * A) Sanity Webhook — Sanity.io/manage'den otomatik tetikler.
 *    Sanity, doküman güncellendiğinde bu URL'yi çağırır.
 *    Filtre: _type == "reservation" && (status == "onaylandi" || status == "reddedildi")
 *    Header: sanity-webhook-signature: t=<unix>,v1=<hmac-sha256-hex>
 *
 * B) Manuel Admin Çağrısı — curl / Postman / admin panelden.
 *    Header: Authorization: Bearer <RESERVATION_WEBHOOK_SECRET>
 *    Body:   { reservationId: "<sanity doc _id>" }
 *    Sanity'deki güncel status okunarak e-posta gönderilir.
 */

import crypto from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { writeClient } from '@/sanity/lib/write-client'
import { approvedEmail, rejectedEmail, type ReservationEmailParams } from '@/emails/reservation'

/* ─── Sabitler ────────────────────────────────────────────────────────────── */

const WEBHOOK_SECRET = process.env.RESERVATION_WEBHOOK_SECRET ?? ''
const FROM_EMAIL     = process.env.RESEND_FROM_EMAIL ?? 'rezervasyon@elifdemir.com'

/* ─── Sanity doküman tipi ─────────────────────────────────────────────────── */

type ReservationDoc = {
  _id: string
  name: string
  email: string
  guests: number
  date: string
  time: string
  notes?: string
  status: 'beklemede' | 'onaylandi' | 'reddedildi'
}

/* ─── HMAC doğrulama (Sanity Webhook) ────────────────────────────────────── */

function verifySanitySignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  try {
    // Format: "t=<unix_timestamp>,v1=<sha256_hex>"
    const parts = Object.fromEntries(
      signatureHeader.split(',').map((chunk) => chunk.split('=')),
    ) as Record<string, string>

    const { t, v1 } = parts
    if (!t || !v1) return false

    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${t}.${rawBody}`)
      .digest('hex')

    return crypto.timingSafeEqual(Buffer.from(v1, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

/* ─── Bearer token doğrulama (Manuel çağrı) ──────────────────────────────── */

function verifyBearer(authHeader: string | null, secret: string): boolean {
  if (!authHeader?.startsWith('Bearer ')) return false
  const token = authHeader.slice(7)
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(secret))
}

/* ─── POST Handler ────────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY tanımlı değil.' }, { status: 500 })
  }

  const rawBody  = await req.text()
  const sanityHeader = req.headers.get('sanity-webhook-signature')
  const authHeader   = req.headers.get('authorization')

  /* ── Kimlik doğrulama ── */
  let reservationDoc: ReservationDoc | null = null

  if (sanityHeader) {
    /* Senaryo A: Sanity webhook */
    if (WEBHOOK_SECRET && !verifySanitySignature(rawBody, sanityHeader, WEBHOOK_SECRET)) {
      return NextResponse.json({ error: 'Geçersiz webhook imzası.' }, { status: 401 })
    }
    try {
      reservationDoc = JSON.parse(rawBody) as ReservationDoc
    } catch {
      return NextResponse.json({ error: 'Geçersiz JSON gövdesi.' }, { status: 400 })
    }
  } else {
    /* Senaryo B: Manuel Bearer çağrısı */
    if (WEBHOOK_SECRET && !verifyBearer(authHeader, WEBHOOK_SECRET)) {
      return NextResponse.json({ error: 'Yetkisiz istek.' }, { status: 401 })
    }
    let body: { reservationId?: string }
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Geçersiz JSON gövdesi.' }, { status: 400 })
    }

    if (!body.reservationId) {
      return NextResponse.json({ error: '`reservationId` gerekli.' }, { status: 422 })
    }

    /* Sanity'den güncel dokümanı çek */
    reservationDoc = await writeClient
      .fetch<ReservationDoc>(
        `*[_type == "reservation" && _id == $id][0]{ _id, name, email, guests, date, time, notes, status }`,
        { id: body.reservationId },
      )
      .catch(() => null)

    if (!reservationDoc) {
      return NextResponse.json({ error: 'Rezervasyon bulunamadı.' }, { status: 404 })
    }
  }

  const { name, email, guests, date, time, notes, status } = reservationDoc

  /* ── Sadece onaylandi / reddedildi durumlarında e-posta gönder ── */
  if (status !== 'onaylandi' && status !== 'reddedildi') {
    return NextResponse.json(
      { skipped: true, reason: `Status "${status}" için e-posta gönderilmez.` },
      { status: 200 },
    )
  }

  const emailParams: ReservationEmailParams = { name, date, time, guests, notes }
  const html    = status === 'onaylandi' ? approvedEmail(emailParams) : rejectedEmail(emailParams)
  const subject = status === 'onaylandi'
    ? '✅ Rezervasyonunuz Onaylandı — Elif Demir'
    : 'Rezervasyon Talebiniz Hakkında — Elif Demir'

  /* ── Resend ile gönder ── */
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: `Elif Demir <${FROM_EMAIL}>`,
    to:   email,
    subject,
    html,
  })

  if (error) {
    console.error('[reservation/status] Resend hatası:', error)
    return NextResponse.json({ error: 'E-posta gönderilemedi.', detail: error }, { status: 502 })
  }

  return NextResponse.json({ success: true, sentTo: email, status })
}

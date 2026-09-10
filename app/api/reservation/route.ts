import { type NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/write-client'

/* ─── Sabitler ────────────────────────────────────────────────────────────── */

const VALID_TIMES = ['12:00', '14:00', '16:00', '18:00', '20:00']

/** Bir saat dilimine alınabilecek maksimum rezervasyon. Env ile override edilebilir. */
const MAX_SLOT = parseInt(process.env.RESERVATION_SLOT_CAPACITY ?? '3', 10)

/* ─── Tipler ──────────────────────────────────────────────────────────────── */

type ReservationBody = {
  name: string
  email: string
  phone: string
  guests: number
  date: string  // YYYY-MM-DD
  time: string  // "12:00" gibi
  notes?: string
}

/* ─── Yardımcılar ─────────────────────────────────────────────────────────── */

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

/* ─── POST Handler ────────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  /* 1 ── JSON parse */
  let body: ReservationBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek gövdesi.' }, { status: 400 })
  }

  const { name, email, phone, guests, date, time, notes } = body

  /* 2 ── Sunucu tarafı doğrulama */
  const errs: string[] = []
  if (!name?.trim())                               errs.push('Ad Soyad zorunludur.')
  if (!email?.trim() || !isValidEmail(email))      errs.push('Geçerli bir e-posta gerekli.')
  if (!phone?.trim())                              errs.push('Telefon zorunludur.')
  if (!Number.isInteger(guests) || guests < 1 || guests > 10)
                                                   errs.push('Kişi sayısı 1-10 arasında olmalı.')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) errs.push('Geçerli bir tarih gerekli.')
  if (!VALID_TIMES.includes(time))                 errs.push('Geçerli bir saat seçilmeli.')

  if (errs.length) {
    return NextResponse.json({ error: errs.join(' ') }, { status: 422 })
  }

  /* 3 ── Write token kontrolü */
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('[reservation] SANITY_API_WRITE_TOKEN tanımlı değil.')
    return NextResponse.json(
      { error: 'Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 },
    )
  }

  /* 4 ── Kapasite kontrolü
         "reddedildi" dışındaki aktif rezervasyonları say.
         writeClient useCdn:false olduğundan her zaman taze veri döner. */
  const slotCount = await writeClient
    .fetch<number>(
      `count(*[_type == "reservation" && date == $date && time == $time && status != "reddedildi"])`,
      { date, time },
    )
    .catch(() => 0) // Sanity ulaşılamazsa kapasiteyi bloke etme, kayda izin ver

  if (slotCount >= MAX_SLOT) {
    return NextResponse.json(
      {
        error: `Seçtiğiniz tarih ve saat için kontenjan dolmuştur. (Maks. ${MAX_SLOT} rezervasyon / saat)`,
      },
      { status: 400 },
    )
  }

  /* 5 ── Sanity'ye kaydet */
  try {
    const doc = await writeClient.create({
      _type: 'reservation',
      name:  name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      guests,
      date,
      time,
      notes:  notes?.trim() || undefined,
      status: 'beklemede',
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, id: doc._id }, { status: 201 })
  } catch (err) {
    console.error('[reservation] Sanity yazma hatası:', err)
    return NextResponse.json(
      { error: 'Rezervasyon kaydedilemedi. Lütfen tekrar deneyin.' },
      { status: 500 },
    )
  }
}

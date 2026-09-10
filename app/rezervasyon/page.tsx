import type { Metadata } from 'next'
import { Clock, MapPin, Phone, Mail } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { Reveal } from '@/components/reveal'
import { ReservationForm } from './reservation-form'

export const metadata: Metadata = {
  title: 'Rezervasyon — Elif Demir',
  description:
    'Online rezervasyon formu. Tarihinizi, saatinizi ve kişi sayısını seçerek hızlıca talep gönderin.',
}

/* ─── Statik veriler ──────────────────────────────────────────────────────── */

const CONTACT_ITEMS = [
  { icon: Phone, label: 'Telefon', value: '+90 212 000 00 00' },
  { icon: Mail, label: 'E-posta', value: 'rezervasyon@elifdemir.com' },
  { icon: MapPin, label: 'Adres', value: 'Karaköy, İstanbul, Türkiye' },
]

const HOURS = [
  { day: 'Pazartesi – Cuma', hours: '12:00 – 22:00' },
  { day: 'Cumartesi', hours: '11:00 – 23:00' },
  { day: 'Pazar', hours: '11:00 – 22:00' },
]

/* ─── Sayfa ───────────────────────────────────────────────────────────────── */

export default function ReservasyonPage() {
  return (
    <>
      <SiteNav />

      <main className="min-h-screen pb-32 pt-32">
        <div className="mx-auto max-w-6xl px-6">

          {/* ── Sayfa başlığı ── */}
          <Reveal className="mb-16 border-b border-border pb-10">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.35em] text-primary">
              Rezervasyon
            </span>
            <h1 className="text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl">
              Yer ayırt<span className="text-primary">.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Aşağıdaki formu doldurun, 24 saat içinde onay mesajı gönderelim.
            </p>
          </Reveal>

          {/* ── İki sütunlu düzen ── */}
          <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">

            {/* ══ Sol: Bilgi Paneli ══ */}
            <Reveal className="flex flex-col gap-10">

              {/* Hizmet tanıtımı */}
              <div>
                <h2 className="text-2xl font-medium tracking-tight">
                  Stüdyo & Çalışma Alanı
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Tasarım atölyeleri, bire bir danışmanlık seansları ve ekip
                  workshopları için özel olarak tasarlanmış bir ortam.
                  Minimalist estetiği ve sessiz atmosferiyle yaratıcı odağınızı
                  en üst düzeye çıkarır.
                </p>
              </div>

              {/* İletişim */}
              <div>
                <span className="mb-4 block font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  İletişim
                </span>
                <ul className="flex flex-col gap-4">
                  {CONTACT_ITEMS.map(({ icon: Icon, label, value }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                        <Icon className="size-4 text-muted-foreground" />
                      </span>
                      <div>
                        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                          {label}
                        </p>
                        <p className="mt-0.5 text-sm text-foreground">
                          {value}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Çalışma saatleri */}
              <div>
                <span className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  <Clock className="size-3.5" />
                  Çalışma Saatleri
                </span>
                <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
                  {HOURS.map(({ day, hours }) => (
                    <li
                      key={day}
                      className="flex items-center justify-between bg-card px-4 py-3.5"
                    >
                      <span className="text-sm text-muted-foreground">{day}</span>
                      <span className="font-mono text-xs font-medium tracking-wider text-foreground">
                        {hours}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  * Rezervasyonlar en az 24 saat öncesinden yapılmalıdır.
                </p>
              </div>
            </Reveal>

            {/* ══ Sağ: Form ══ */}
            <Reveal delay={80}>
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h2 className="mb-6 text-lg font-medium tracking-tight">
                  Rezervasyon Formu
                </h2>
                <ReservationForm />
              </div>
            </Reveal>
          </div>
        </div>
      </main>
    </>
  )
}

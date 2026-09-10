'use client'

import { useState, useCallback, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toast } from '@/components/toast'

/* ─── Sabit veriler ───────────────────────────────────────────────────────── */

const TIME_SLOTS = ['12:00', '14:00', '16:00', '18:00', '20:00']
const GUEST_COUNTS = Array.from({ length: 10 }, (_, i) => i + 1)

/* ─── Tipler ──────────────────────────────────────────────────────────────── */

type FormData = {
  fullName: string
  email: string
  phone: string
  guestCount: string
  date: string
  time: string
  notes: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const EMPTY: FormData = {
  fullName: '',
  email: '',
  phone: '',
  guestCount: '2',
  date: '',
  time: '',
  notes: '',
}

/* ─── Yardımcılar ─────────────────────────────────────────────────────────── */

/** Bugünün tarihi (YYYY-MM-DD) — date input min değeri için */
function todayIso() {
  return new Date().toISOString().split('T')[0]
}

/** Ortak input sınıfı */
const inputCls = cn(
  'w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground',
  'placeholder:text-muted-foreground',
  'transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0',
  'disabled:opacity-50',
)

/* ─── Bileşen ─────────────────────────────────────────────────────────────── */

export function ReservationForm() {
  const [form, setForm] = useState<FormData>(EMPTY)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [toast, setToast] = useState(false)

  const dismissToast = useCallback(() => setToast(false), [])

  /* Doğrulama */
  function validate(): boolean {
    const e: Partial<FormData> = {}
    if (!form.fullName.trim()) e.fullName = 'Ad Soyad zorunludur.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Geçerli bir e-posta girin.'
    if (!form.phone.trim()) e.phone = 'Telefon numarası zorunludur.'
    if (!form.date) e.date = 'Tarih seçiniz.'
    if (!form.time) e.time = 'Saat seçiniz.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* Gönderim */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    setServerError(null)

    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          guests: parseInt(form.guestCount, 10),
          date: form.date,
          time: form.time,
          notes: form.notes,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Beklenmedik bir hata oluştu.')
      }

      setStatus('success')
      setToast(true)
      setForm(EMPTY)
      setErrors({})
    } catch (err) {
      setStatus('error')
      setServerError(err instanceof Error ? err.message : 'Bir hata oluştu.')
    }
  }

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const isLoading = status === 'loading'

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-6"
      >
        {/* ── Ad Soyad ── */}
        <Field label="Ad Soyad" error={errors.fullName} required>
          <input
            type="text"
            placeholder="Elif Demir"
            value={form.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            disabled={isLoading}
            className={cn(inputCls, errors.fullName && 'border-destructive focus:ring-destructive')}
          />
        </Field>

        {/* ── E-posta + Telefon ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-posta" error={errors.email} required>
            <input
              type="email"
              placeholder="merhaba@ornek.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              disabled={isLoading}
              className={cn(inputCls, errors.email && 'border-destructive focus:ring-destructive')}
            />
          </Field>
          <Field label="Telefon" error={errors.phone} required>
            <input
              type="tel"
              placeholder="+90 555 000 00 00"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              disabled={isLoading}
              className={cn(inputCls, errors.phone && 'border-destructive focus:ring-destructive')}
            />
          </Field>
        </div>

        {/* ── Kişi Sayısı + Tarih ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kişi Sayısı">
            <select
              value={form.guestCount}
              onChange={(e) => set('guestCount', e.target.value)}
              disabled={isLoading}
              className={cn(inputCls, 'cursor-pointer')}
            >
              {GUEST_COUNTS.map((n) => (
                <option key={n} value={n}>
                  {n} kişi
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tarih" error={errors.date} required>
            <input
              type="date"
              min={todayIso()}
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              disabled={isLoading}
              className={cn(
                inputCls,
                'cursor-pointer',
                errors.date && 'border-destructive focus:ring-destructive',
              )}
            />
          </Field>
        </div>

        {/* ── Saat Seçimi (Chip) ── */}
        <Field label="Saat" error={errors.time} required>
          <div className="flex flex-wrap gap-2 pt-1">
            {TIME_SLOTS.map((slot) => {
              const active = form.time === slot
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isLoading}
                  onClick={() => set('time', slot)}
                  className={cn(
                    'rounded-full border px-4 py-2 font-mono text-xs tracking-wider transition-all duration-200',
                    active
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                    'disabled:pointer-events-none disabled:opacity-50',
                  )}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </Field>

        {/* ── Özel Notlar ── */}
        <Field label="Özel Notlar">
          <textarea
            rows={4}
            placeholder="Doğum günü, vejetaryen menü, pencere kenarı tercihi…"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            disabled={isLoading}
            className={cn(inputCls, 'resize-none')}
          />
        </Field>

        {/* ── Gönder ── */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'relative flex h-12 w-full items-center justify-center gap-2.5 rounded-lg',
            'bg-primary font-mono text-sm font-medium uppercase tracking-widest text-primary-foreground',
            'transition-opacity duration-200 hover:opacity-80',
            'disabled:pointer-events-none disabled:opacity-60',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Gönderiliyor…
            </>
          ) : (
            'Rezervasyon Talep Et'
          )}
        </button>

        {/* ── Başarı mesajı ── */}
        {status === 'success' && (
          <p className="text-center font-mono text-xs uppercase tracking-widest text-emerald-500">
            ✓ Talebiniz alındı — En kısa sürede dönüş yapılacak.
          </p>
        )}

        {/* ── Sunucu hatası ── */}
        {status === 'error' && serverError && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-center font-mono text-xs text-destructive">
            {serverError}
          </p>
        )}
      </form>

      {/* ── Toast ── */}
      <Toast
        visible={toast}
        onDismiss={dismissToast}
        variant="success"
        message="Rezervasyon talebiniz başarıyla alındı!"
        description="En kısa sürede sizinle iletişime geçeceğiz."
      />
    </>
  )
}

/* ─── Alan sarmalayıcı ────────────────────────────────────────────────────── */

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
        {required && <span className="text-primary">*</span>}
      </label>
      {children}
      {error && (
        <p className="font-mono text-[0.7rem] text-destructive">{error}</p>
      )}
    </div>
  )
}

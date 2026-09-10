'use client'

import { useState, type FormEvent } from 'react'

const ACCESS_KEY = '332eda03-fadc-4cb1-ab13-3b1d8c2c5c97'
const SUBMIT_URL = 'https://api.web3forms.com/submit'

const fieldClass =
  'mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm tracking-tight outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch(SUBMIT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: String(data.get('name') ?? '').trim(),
          email: String(data.get('email') ?? '').trim(),
          message: String(data.get('message') ?? '').trim(),
          subject: 'Portfolyo iletişim formu',
        }),
      })

      const result = (await response.json()) as { success?: boolean; message?: string }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gönderim başarısız.')
      }

      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
    }
  }

  if (status === 'success') {
    return (
      <p
        role="status"
        className="rounded-lg border border-border bg-secondary px-6 py-10 text-center text-lg font-medium tracking-tight"
      >
        Mesajınız başarıyla iletildi!
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Ad Soyad
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Adınız ve soyadınız"
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            E-posta
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="ornek@posta.com"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Mesaj
        </span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Projeniz veya merak ettiğiniz şey..."
          className={`${fieldClass} resize-y min-h-36`}
        />
      </label>

      {status === 'error' ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 font-mono text-sm uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
      >
        {status === 'submitting' ? 'Gönderiliyor' : 'Gönder'}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}

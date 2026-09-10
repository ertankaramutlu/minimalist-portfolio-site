import Link from 'next/link'
import { ContactForm } from '@/components/contact-form'
import { Reveal } from '@/components/reveal'

const SOCIALS = [
  { label: 'E-posta', value: 'merhaba@elifdemir.com', href: 'mailto:merhaba@elifdemir.com' },
  { label: 'LinkedIn', value: '/in/elifdemir', href: '#' },
  { label: 'GitHub', value: '@elifdemir', href: '#' },
  { label: 'Dribbble', value: '@elifdemir', href: '#' },
]

const MARQUEE = 'Birlikte çalışalım'

export function Contact() {
  return (
    <footer id="contact" className="border-t border-border">
      <div className="overflow-hidden border-b border-border py-8">
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="mx-6 text-5xl font-medium tracking-tight text-muted-foreground sm:text-7xl"
            >
              {MARQUEE} <span className="text-primary">{'/'}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal
          as="span"
          className="mb-10 block font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground"
        >
          04 — İletişim
        </Reveal>

        <Reveal>
          <h2 className="max-w-3xl text-balance text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
            Yeni bir proje mi var, yoksa sadece merhaba mı? Yazmaktan çekinme.
          </h2>
        </Reveal>

        <Reveal delay={120} className="mt-12 max-w-2xl">
          <ContactForm />
        </Reveal>

        <div className="mt-20 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
          {SOCIALS.map((social, i) => (
            <Reveal
              key={social.label}
              delay={i * 70}
              className="bg-background p-6"
            >
              <a href={social.href} className="group block">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {social.label}
                </span>
                <span className="mt-2 block truncate text-sm transition-colors group-hover:text-primary">
                  {social.value}
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Elif Demir</span>

          {/* Hızlı menü */}
          <nav aria-label="Alt bilgi menüsü">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                { href: '/#work', label: 'İşler' },
                { href: '/#about', label: 'Hakkında' },
                { href: '/#contact', label: 'İletişim' },
                { href: '/blog', label: 'Blog' },
                { href: '/events', label: 'Etkinlikler' },
                { href: '/rezervasyon', label: 'Rezervasyon' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <span>İstanbul, Türkiye</span>
        </div>
      </div>
    </footer>
  )
}

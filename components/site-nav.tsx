'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

const ANCHOR_LINKS = [
  { href: '/#work', label: 'İşler' },
  { href: '/#about', label: 'Hakkında' },
  { href: '/#faq', label: 'SSS' },
  { href: '/#contact', label: 'İletişim' },
]

const ROUTE_LINKS = [
  { href: '/blog', label: 'Blog' },
  { href: '/events', label: 'Etkinlikler' },
]

const CTA = { href: '/rezervasyon', label: 'Rezervasyon' }

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = 'font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground'
  const activeLinkClass = 'font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:text-foreground'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-500',
        scrolled ? 'border-b border-border bg-background/80 backdrop-blur-md' : 'border-b border-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/#top"
          className="font-mono text-sm font-medium tracking-tight"
        >
          Elif Demir<span className="text-primary">.</span>
        </Link>

        <ul className="flex items-center gap-3 sm:gap-4">
          {ANCHOR_LINKS.map((link, i) => (
            <li key={link.href} className="flex items-center gap-3 sm:gap-4">
              {i > 0 && (
                <span aria-hidden className="text-border select-none">·</span>
              )}
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}

          {/* Ayırıcı çizgi */}
          <li aria-hidden className="hidden h-3.5 w-px bg-border sm:block" />

          {ROUTE_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname.startsWith(link.href) ? activeLinkClass : linkClass}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Tema değiştirme butonu */}
          <li>
            <ThemeToggle />
          </li>

          {/* Rezervasyon CTA */}
          <li className="hidden sm:block">
            <Link
              href={CTA.href}
              className={cn(
                'inline-flex items-center rounded-lg px-3.5 py-1.5',
                'font-mono text-xs uppercase tracking-widest',
                'transition-opacity duration-200 hover:opacity-80',
                pathname.startsWith(CTA.href)
                  ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
                  : 'bg-primary text-primary-foreground',
              )}
            >
              {CTA.label}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

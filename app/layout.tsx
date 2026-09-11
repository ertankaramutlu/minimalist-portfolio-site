import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://minimalist-portfolio-site-six.vercel.app'),

  title: {
    default:  'Elif Demir | Dijital Ürün Tasarımcısı & Sistem Mimarisi',
    template: '%s | Elif Demir',
  },

  description:
    'Modern web teknolojileri, UI/UX tasarımı ve sistem mimarisi odaklı kişisel portfolyo.',

  keywords: ['Web Tasarım', 'Next.js', 'UI/UX', 'Figma', 'Webflow', 'Sistem Mimarisi'],

  authors: [{ name: 'Elif Demir' }],

  openGraph: {
    title:       'Elif Demir | Dijital Ürün Tasarımcısı & Sistem Mimarisi',
    description: 'Modern web teknolojileri, UI/UX tasarımı ve sistem mimarisi odaklı kişisel portfolyo.',
    url:         'https://minimalist-portfolio-site-six.vercel.app',
    siteName:    'Elif Demir Portfolio',
    locale:      'tr_TR',
    type:        'website',
    images: [
      {
        url:    '/og-image.png',
        width:  1200,
        height: 630,
        alt:    'Elif Demir Portfolio OpenGraph Image',
      },
    ],
  },

  twitter: {
    card:        'summary_large_image',
    title:       'Elif Demir | Dijital Ürün Tasarımcısı & Sistem Mimarisi',
    description: 'Modern web teknolojileri, UI/UX tasarımı ve sistem mimarisi odaklı kişisel portfolyo.',
    images:      ['/og-image.png'],
  },

  icons: {
    icon: [
      {
        url:   '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url:   '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url:  '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body id="top" className="bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}

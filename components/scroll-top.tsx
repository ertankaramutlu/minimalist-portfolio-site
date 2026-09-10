'use client'

import { useEffect } from 'react'

/**
 * Sayfa yenilendiğinde tarayıcının scroll geri yükleme belleğini iptal eder
 * ve hemen en üste kaydırır. `app/page.tsx` gibi Server Component'lere
 * bu küçük Client Component eklenerek kullanılır.
 */
export function ScrollTop() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return null
}

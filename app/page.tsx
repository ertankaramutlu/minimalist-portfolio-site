import { IntroOverlay } from '@/components/intro-overlay'
import { ScrollProgress } from '@/components/scroll-progress'
import { SiteNav } from '@/components/site-nav'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Work } from '@/components/work'
import { Faq } from '@/components/faq'
import { Contact } from '@/components/contact'
import { Testimonials } from '@/components/testimonials'
import { ScrollTop } from '@/components/scroll-top'

export default function Page() {
  return (
    <>
      <ScrollTop />
      <IntroOverlay />
      <ScrollProgress />
      <SiteNav />
      <main>
        <Hero />
        <Work />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
    </>
  )
}

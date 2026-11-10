import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PROJECTS } from '@/components/work'
import { SiteNav } from '@/components/site-nav'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Tüm İşler — Ertan Karamutlu',
  description: 'Ertan Karamutlu tarafından yürütülen tüm projeler.',
}

export default function WorksPage() {
  return (
    <>
      <SiteNav />
      <main className="pb-32 pt-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-16 border-b border-border pb-10">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.35em] text-primary">
              Portfolio
            </span>
            <h1 className="text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl">
              Tüm İşler<span className="text-primary">.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Geçtiğimiz beş yılda üzerine çalıştığım projeler.
            </p>
          </Reveal>

          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <Reveal key={project.name} delay={i * 40}>
                <a href="#contact" className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary">
                    <Image
                      src={project.image || '/placeholder.svg'}
                      alt={`${project.name} — ${project.role}`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="text-xl font-medium tracking-tight">
                      {project.name}
                      <span className="ml-2 inline-block text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        →
                      </span>
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      {project.year}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{project.role}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              ← Anasayfaya Dön
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
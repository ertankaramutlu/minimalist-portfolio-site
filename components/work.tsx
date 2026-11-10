import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'

export type Project = {
  name: string
  role: string
  year: string
  image: string
  tags: string[]
}

export const PROJECTS: Project[] = [
  {
    name: 'Meridian',
    role: 'Fintech kontrol paneli',
    year: '2025',
    image: '/work/meridian.png',
    tags: ['Ürün', 'Tasarım Sistemi', 'Next.js'],
  },
  {
    name: 'Atlas Type',
    role: 'Dijital font dökümhanesi',
    year: '2024',
    image: '/work/atlas.png',
    tags: ['Marka', 'Web', 'Etkileşim'],
  },
  {
    name: 'Sonder',
    role: 'Günlük tutma uygulaması',
    year: '2024',
    image: '/work/sonder.png',
    tags: ['Mobil', 'Ürün', 'Prototip'],
  },
  {
    name: 'Form & Field',
    role: 'Mimarlık stüdyosu sitesi',
    year: '2023',
    image: '/work/form-field.png',
    tags: ['Web', 'Sanat Yönetimi'],
  },
  {
    name: 'Lumina',
    role: 'E-ticaret arayüzü',
    year: '2025',
    image: '/work/meridian.png',
    tags: ['E-ticaret', 'Next.js'],
  },
  {
    name: 'Nebula',
    role: 'Sağlık takip uygulaması',
    year: '2025',
    image: '/work/atlas.png',
    tags: ['Mobil', 'Sağlık'],
  },
  {
    name: 'Obsidian',
    role: 'Kripto cüzdan arayüzü',
    year: '2024',
    image: '/work/sonder.png',
    tags: ['Fintech', 'Web3'],
  },
  {
    name: 'Aether',
    role: 'Çalışma ve üretkenlik aracı',
    year: '2024',
    image: '/work/form-field.png',
    tags: ['SaaS', 'Üretkenlik'],
  },
  {
    name: 'Vertex',
    role: 'Mobilya markası sitesi',
    year: '2023',
    image: '/work/form-field.png',
    tags: ['Marka', 'Web'],
  },
  {
    name: 'Prism',
    role: 'Finansal planlama uygulaması',
    year: '2023',
    image: '/work/sonder.png',
    tags: ['Fintech', 'Mobil'],
  },
  {
    name: 'Zenith',
    role: 'Portfolio vemarka kimliği',
    year: '2022',
    image: '/work/atlas.png',
    tags: ['Marka', 'Tasarım Sistemi'],
  },
]

const DISPLAY_LIMIT = 4

export function Work() {
  const visible = PROJECTS.slice(0, DISPLAY_LIMIT)

  return (
    <section id="work" className="border-t border-border px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 flex items-end justify-between gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
            02 — Seçili İşler
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {visible.length} proje
          </span>
        </Reveal>

        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2">
          {visible.map((project, i) => (
            <Reveal key={project.name} delay={(i % 2) * 100}>
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

        <div className="mt-16 flex justify-center">
          <Link
            href="/works"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Tüm İşleri Gör →
          </Link>
        </div>
      </div>
    </section>
  )
}

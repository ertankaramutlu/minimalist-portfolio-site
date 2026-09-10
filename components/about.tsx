import { Reveal } from '@/components/reveal'

const CAPABILITIES = [
  { title: 'Ürün Tasarımı', desc: 'Araştırmadan arayüze kadar uçtan uca ürün akışları.' },
  { title: 'Tasarım Sistemleri', desc: 'Ölçeklenebilir bileşen kütüphaneleri ve tasarım tokenları.' },
  { title: 'Frontend', desc: 'React, Next.js ve erişilebilir, performanslı arayüzler.' },
  { title: 'Prototipleme', desc: 'Fikirleri hızlıca test edilebilir etkileşimlere dönüştürme.' },
]

export function About() {
  return (
    <section id="about" className="border-t border-border px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal
          as="span"
          className="mb-16 block font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground"
        >
          01 — Hakkında
        </Reveal>

        <Reveal>
          <p className="max-w-3xl text-balance text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
            Tasarımın işini yaptığında görünmez olduğuna inanıyorum. Fazlalıkları
            eleyerek, insanların gerçekten ihtiyaç duyduğu şeyi öne çıkaran
            arayüzler kurmaya çalışıyorum.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {CAPABILITIES.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 80}
              className="bg-background p-8 transition-colors hover:bg-secondary"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-medium tracking-tight">{item.title}</h3>
                <span className="font-mono text-xs text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

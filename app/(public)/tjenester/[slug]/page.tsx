import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check } from 'lucide-react'

import { getService, services } from '@/lib/services'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return {
    title: service.title,
    description: service.summary,
  }
}

export default async function TjenesteDetaljPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3)

  return (
    <>
      <section className="border-border border-b px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/tjenester"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] uppercase transition-colors"
          >
            <ArrowRight className="h-3 w-3 rotate-180" />
            Alle tjenester
          </Link>
          <p className="text-muted-foreground mt-10 font-mono text-xs tracking-[0.3em] uppercase">
            {service.kicker}
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
            {service.title}
          </h1>
          <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
            {service.summary}
          </p>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[1.4fr_1fr] md:gap-20">
          <article className="prose-paragraph">
            <p className="text-foreground/90 text-lg leading-relaxed md:text-xl">
              {service.description}
            </p>
          </article>

          <aside>
            <h2 className="text-muted-foreground mb-6 font-mono text-xs tracking-[0.3em] uppercase">
              Det vi leverer
            </h2>
            <ul className="space-y-4">
              {service.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed">
                  <Check className="text-foreground/70 mt-0.5 h-4 w-4 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-border border-t px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-muted-foreground mb-10 font-mono text-xs tracking-[0.3em] uppercase">
            Andre tjenester
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/tjenester/${r.slug}`}
                className="group border-border hover:border-foreground/40 flex flex-col gap-3 rounded-xl border p-6 transition-colors md:p-8"
              >
                <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
                  {r.kicker}
                </p>
                <h3 className="text-xl font-semibold tracking-tight">{r.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{r.summary}</p>
                <span className="text-foreground/80 group-hover:text-foreground mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium transition-colors">
                  Les mer
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-foreground text-background px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">
              {service.title.toLowerCase()}-prosjekt?
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              La oss snakke om hva som er mulig.
            </h2>
          </div>
          <Link
            href="/kontakt"
            className="bg-background text-foreground hover:bg-background/90 inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium tracking-wide transition-colors"
          >
            Få et tilbud
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}

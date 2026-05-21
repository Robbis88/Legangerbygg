import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { services } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Tjenester',
  description:
    'Nybygg, totalrenovering, rehabilitering, flipp og prosjektledelse. Tømrer Ronny Osvaag AS leverer kvalitet i hvert prosjekt.',
}

export default function TjenesterPage() {
  return (
    <>
      <section className="border-border border-b px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
            Tjenester
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Vi bygger det
            <br />
            som skal stå.
          </h1>
          <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
            Fra nybygg og totalrenovering til rehabilitering og prosjektledelse — vi tar oss av
            tømrerfaget med presisjon, dokumentert kvalitet og tett dialog gjennom hele prosessen.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-2xl border md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/tjenester/${service.slug}`}
              className="group bg-background hover:bg-muted/40 relative flex flex-col gap-4 p-8 transition-colors md:p-10"
            >
              <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
                {service.kicker}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{service.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.summary}</p>
              <span className="text-foreground/80 group-hover:text-foreground mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium tracking-wide transition-colors">
                Les mer
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBanner />
    </>
  )
}

function CtaBanner() {
  return (
    <section className="bg-foreground text-background border-border border-t px-6 py-24 md:py-32">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">
            Klar for neste prosjekt?
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Ta kontakt for en uforpliktende prat.
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
  )
}

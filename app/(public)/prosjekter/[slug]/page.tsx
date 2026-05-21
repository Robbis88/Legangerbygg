import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

import { getAllPublishedSlugs, getProjectBySlug } from '@/lib/queries/projects'
import type { Database } from '@/types/supabase'

type Params = { slug: string }

const typeLabels: Record<Database['public']['Enums']['project_type'], string> = {
  nybygg: 'Nybygg',
  rehabilitering: 'Rehabilitering',
  totalrenovering: 'Totalrenovering',
  flipp: 'Flipp',
  moske: 'Moské',
  leilighet: 'Leilighet',
  rekkehus: 'Rekkehus',
  prosjektledelse: 'Prosjektledelse',
  innvendig: 'Innvendig',
  utvendig: 'Utvendig',
  annet: 'Annet',
}

const statusLabels: Record<Database['public']['Enums']['project_status'], string> = {
  planlegging: 'Planlegging',
  pagaende: 'Pågående',
  pa_vent: 'På vent',
  ferdig: 'Ferdig',
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description ?? undefined,
    openGraph: project.cover_image_url
      ? { images: [{ url: project.cover_image_url }] }
      : undefined,
  }
}

const dateFormatter = new Intl.DateTimeFormat('nb-NO', {
  year: 'numeric',
  month: 'long',
})

function formatPeriod(start: string | null, end: string | null): string | null {
  if (!start) return null
  const startStr = dateFormatter.format(new Date(start))
  if (!end) return `${startStr} – pågående`
  const endStr = dateFormatter.format(new Date(end))
  return `${startStr} – ${endStr}`
}

export default async function ProsjektDetalj({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  const beforeImages = project.images.filter((i) => i.is_before)
  const afterImages = project.images.filter((i) => i.is_after)
  const galleryImages = project.images.filter((i) => !i.is_before && !i.is_after)
  const hasBeforeAfter = beforeImages.length > 0 && afterImages.length > 0
  const period = formatPeriod(project.start_date, project.end_date)

  return (
    <>
      {/* Cover-hero — fullbleed bilde med tittel-overlay */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden md:h-[80vh]">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="bg-muted absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white md:p-16">
          <div className="mx-auto w-full max-w-7xl">
            <Link
              href="/prosjekter"
              className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-80 hover:opacity-100"
            >
              ← Alle prosjekter
            </Link>
            <p className="mt-8 font-mono text-[11px] tracking-[0.3em] uppercase opacity-80">
              {typeLabels[project.type]}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
              {project.title}
            </h1>
            {project.address ? (
              <p className="mt-3 text-sm opacity-80 md:text-base">{project.address}</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Faktablokk */}
      <section className="border-border border-b px-6 py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          <FactRow label="Type" value={typeLabels[project.type]} />
          <FactRow label="Status" value={statusLabels[project.status]} />
          <FactRow label="Sted" value={project.address ?? '—'} />
          <FactRow label="Periode" value={period ?? '—'} />
        </div>
      </section>

      {/* Beskrivelse */}
      {project.description ? (
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[1fr_1.4fr] md:gap-20">
            <h2 className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
              Om prosjektet
            </h2>
            <p className="text-foreground/90 text-lg leading-relaxed md:text-xl">
              {project.description}
            </p>
          </div>
        </section>
      ) : null}

      {/* Før / etter */}
      {hasBeforeAfter ? (
        <section className="border-border border-y bg-muted/30 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-muted-foreground mb-12 font-mono text-xs tracking-[0.3em] uppercase">
              Før / etter
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground mb-4 font-mono text-[10px] tracking-[0.3em] uppercase">
                  Før
                </p>
                <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={beforeImages[0].url}
                    alt="Før-bilde"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-4 font-mono text-[10px] tracking-[0.3em] uppercase">
                  Etter
                </p>
                <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={afterImages[0].url}
                    alt="Etter-bilde"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Galleri */}
      {galleryImages.length > 0 ? (
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-muted-foreground mb-12 font-mono text-xs tracking-[0.3em] uppercase">
              Galleri
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-muted relative aspect-[4/3] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={image.url}
                    alt={image.caption ?? project.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="bg-foreground text-background px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">
              Vurderer et lignende prosjekt?
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

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
        {label}
      </p>
      <p className="text-base md:text-lg">{value}</p>
    </div>
  )
}

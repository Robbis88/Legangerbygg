import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { ArrowRight } from 'lucide-react'

import { getPublishedProjects, type ProjectFilter, type ProjectListItem } from '@/lib/queries/projects'
import type { Database } from '@/types/supabase'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Prosjekter',
  description:
    'Utvalg av prosjekter Tømrer Ronny Osvaag AS har levert — nybygg, totalrenoveringer, flipp og moské-prosjekter i Bergen.',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type FilterDef = {
  label: string
  href: string
  matches: (params: SearchParams) => boolean
  toFilter: () => ProjectFilter
}

const filters: FilterDef[] = [
  {
    label: 'Alle',
    href: '/prosjekter',
    matches: (p) => !p.type && !p.status && !p.special,
    toFilter: () => ({}),
  },
  {
    label: 'Nybygg',
    href: '/prosjekter?type=nybygg',
    matches: (p) => p.type === 'nybygg',
    toFilter: () => ({ type: 'nybygg' }),
  },
  {
    label: 'Totalrenovering',
    href: '/prosjekter?type=totalrenovering',
    matches: (p) => p.type === 'totalrenovering',
    toFilter: () => ({ type: 'totalrenovering' }),
  },
  {
    label: 'Flipp',
    href: '/prosjekter?type=flipp',
    matches: (p) => p.type === 'flipp',
    toFilter: () => ({ type: 'flipp' }),
  },
  {
    label: 'Moské',
    href: '/prosjekter?type=moske',
    matches: (p) => p.type === 'moske',
    toFilter: () => ({ type: 'moske' }),
  },
  {
    label: 'Rekkehus',
    href: '/prosjekter?type=rekkehus',
    matches: (p) => p.type === 'rekkehus',
    toFilter: () => ({ type: 'rekkehus' }),
  },
  {
    label: 'Før / etter',
    href: '/prosjekter?special=for-etter',
    matches: (p) => p.special === 'for-etter',
    toFilter: () => ({ beforeAfter: true }),
  },
  {
    label: 'Pågående',
    href: '/prosjekter?status=pagaende',
    matches: (p) => p.status === 'pagaende',
    toFilter: () => ({ status: 'pagaende' }),
  },
]

const typeLabels: Partial<Record<Database['public']['Enums']['project_type'], string>> = {
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

export default function ProsjekterPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  return (
    <>
      <section className="border-border border-b px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
            Prosjekter
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Det vi har bygget.
          </h1>
          <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
            Et utvalg gjennomførte og pågående prosjekter — fra nybygg og totalrenoveringer til
            flipp-prosjekter og moské-rehabiliteringer.
          </p>
        </div>
      </section>

      <Suspense fallback={<ProsjekterSkeleton />}>
        <FilteredView searchParams={searchParams} />
      </Suspense>
    </>
  )
}

async function FilteredView({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const active = filters.find((f) => f.matches(params)) ?? filters[0]
  const projects = await getPublishedProjects(active.toFilter())

  return (
    <>
      <section className="border-border bg-muted/30 border-b px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 md:gap-3">
          {filters.map((f) => {
            const isActive = f.label === active.label
            return (
              <Link
                key={f.label}
                href={f.href}
                className={cn(
                  'rounded-full px-4 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-foreground text-background'
                    : 'bg-background text-foreground/80 hover:text-foreground border-border border',
                )}
              >
                {f.label}
              </Link>
            )
          })}
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          {projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <Link
      href={`/prosjekter/${project.slug}`}
      className="group block overflow-hidden rounded-2xl"
    >
      <div className="bg-muted relative aspect-[4/5] overflow-hidden">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground absolute inset-0 flex items-center justify-center font-mono text-xs tracking-[0.3em] uppercase">
            Ingen bilde
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent p-6 text-white">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-80">
            {typeLabels[project.type] ?? project.type}
            {project.status !== 'ferdig' ? ` · ${statusLabels[project.status]}` : null}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
            {project.title}
          </h2>
          {project.address ? (
            <p className="mt-1 text-xs opacity-80">{project.address}</p>
          ) : null}
        </div>
      </div>
      <span className="text-foreground/70 group-hover:text-foreground mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors">
        Se prosjekt
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="border-border flex flex-col items-center gap-4 rounded-2xl border border-dashed py-24 text-center">
      <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
        Ingen prosjekter matcher filteret
      </p>
      <Link
        href="/prosjekter"
        className="text-foreground hover:underline text-sm font-medium"
      >
        Vis alle prosjekter
      </Link>
    </div>
  )
}

function ProsjekterSkeleton() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-muted aspect-[4/5] animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  )
}

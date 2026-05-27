import Link from 'next/link'
import type { Metadata } from 'next'
import { Plus } from 'lucide-react'

import { getAdminProjects } from '@/lib/queries/admin'
import { projectTypeLabels } from '@/lib/validators/inquiry'
import { projectStatusLabels } from '@/lib/validators/project'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Prosjekter',
  robots: { index: false, follow: false },
}

export default async function AdminProsjekterPage() {
  const projects = await getAdminProjects()

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Prosjekter</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {projects.length} {projects.length === 1 ? 'prosjekt' : 'prosjekter'} totalt.
          </p>
        </div>
        <Link
          href="/admin/prosjekter/ny"
          className={cn(buttonVariants(), 'gap-1.5')}
          data-icon="inline-start"
        >
          <Plus className="size-4" />
          Nytt prosjekt
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted-foreground text-sm">Ingen prosjekter ennå.</p>
      ) : (
        <div className="border-border divide-border bg-background divide-y overflow-hidden rounded-2xl border">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/admin/prosjekter/${p.id}`}
              className="hover:bg-muted/50 flex items-center justify-between gap-4 px-5 py-4 transition-colors"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{p.title}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {projectTypeLabels[p.type]} · {projectStatusLabels[p.status]}
                  {p.address ? ` · ${p.address}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase',
                    p.is_public && p.published_at
                      ? 'bg-emerald-500/15 text-emerald-600'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {p.is_public && p.published_at ? 'Publisert' : 'Utkast'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

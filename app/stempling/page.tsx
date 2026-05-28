import type { Metadata } from 'next'

import { getSession } from '@/lib/auth'
import {
  getActivePunch,
  getRecentStamps,
  getStampableProjects,
} from '@/lib/queries/stempling'
import { formatHours } from '@/lib/payroll'
import { StampCard } from '@/components/stempling/stamp-card'

export const metadata: Metadata = {
  title: 'Stempling',
  robots: { index: false, follow: false },
}

const dateFmt = new Intl.DateTimeFormat('nb-NO', { dateStyle: 'medium', timeZone: 'UTC' })

export default async function StemplingPage() {
  const session = await getSession()
  if (!session) return null // layout har allerede redirected

  const [active, projects, recent] = await Promise.all([
    getActivePunch(session.userId),
    getStampableProjects(),
    getRecentStamps(session.userId),
  ])

  return (
    <div className="space-y-10">
      <StampCard active={active} projects={projects} />

      <section className="space-y-3">
        <h2 className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
          Siste føringer
        </h2>
        {recent.length === 0 ? (
          <p className="text-muted-foreground text-sm">Ingen timer ført ennå.</p>
        ) : (
          <div className="border-border divide-border bg-background divide-y overflow-hidden rounded-2xl border">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.project_title}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {dateFmt.format(new Date(`${r.work_date}T00:00:00Z`))}
                    {r.note ? ` · ${r.note}` : ''}
                  </p>
                </div>
                <span className="text-sm font-medium tabular-nums">{formatHours(r.hours)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

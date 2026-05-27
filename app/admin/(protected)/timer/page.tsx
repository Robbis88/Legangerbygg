import type { Metadata } from 'next'

import {
  getTimeEntryOptions,
  getRecentTimeEntries,
  getPayrollSettings,
} from '@/lib/queries/timer'
import { deleteTimeEntry } from '@/lib/actions/timer'
import { formatHours } from '@/lib/payroll'
import { TimeEntryForm } from '@/components/admin/time-entry-form'
import { PayrollSettingsForm } from '@/components/admin/payroll-settings-form'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Timer',
  robots: { index: false, follow: false },
}

const dateFmt = new Intl.DateTimeFormat('nb-NO', { dateStyle: 'medium', timeZone: 'UTC' })

export default async function TimerPage() {
  const [options, recent, settings] = await Promise.all([
    getTimeEntryOptions(),
    getRecentTimeEntries(),
    getPayrollSettings(),
  ])
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Timer</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Før timer per ansatt og prosjekt. Arbeidskost beregnes med satsene under og vises på
          hvert prosjekt.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
          Lønnssatser
        </h2>
        <PayrollSettingsForm settings={settings} />
      </div>

      <div className="space-y-3">
        <h2 className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
          Før timer
        </h2>
        <TimeEntryForm options={options} today={today} />
      </div>

      <div className="space-y-3">
        <h2 className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
          Siste føringer
        </h2>
        {recent.length === 0 ? (
          <p className="text-muted-foreground text-sm">Ingen timer ført ennå.</p>
        ) : (
          <div className="border-border divide-border bg-background divide-y overflow-hidden rounded-2xl border">
            {recent.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {e.employeeName} · {e.projectTitle}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {dateFmt.format(new Date(`${e.work_date}T00:00:00Z`))}
                    {e.note ? ` · ${e.note}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-medium tabular-nums">{formatHours(e.hours)}</span>
                  <form action={deleteTimeEntry}>
                    <input type="hidden" name="id" value={e.id} />
                    <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
                      Slett
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

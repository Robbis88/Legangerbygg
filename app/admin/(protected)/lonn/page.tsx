import Link from 'next/link'
import type { Metadata } from 'next'
import { Download } from 'lucide-react'

import { getLonnReport } from '@/lib/queries/lonn'
import { getTimeEntryOptions } from '@/lib/queries/timer'
import { formatHours, formatNok } from '@/lib/payroll'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Lønn',
  robots: { index: false, follow: false },
}

const selectClass =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

const dateFmt = new Intl.DateTimeFormat('nb-NO', { dateStyle: 'medium', timeZone: 'UTC' })

function defaultPeriod() {
  const today = new Date()
  const first = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  return { from: fmt(first), to: today.toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' }) }
}

export default async function LonnPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; employee?: string }>
}) {
  const params = await searchParams
  const def = defaultPeriod()
  const from = params.from ?? def.from
  const to = params.to ?? def.to
  const employeeId = params.employee && params.employee !== '' ? params.employee : null

  const [report, options] = await Promise.all([
    getLonnReport({ from, to, employeeId }),
    getTimeEntryOptions(),
  ])

  const csvHref = `/api/lonn/csv?from=${from}&to=${to}${employeeId ? `&employee=${employeeId}` : ''}`

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Lønn</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Timer og arbeidskost per ansatt for valgt periode — klar for utbetaling.
          </p>
        </div>
        <a
          href={csvHref}
          className={cn(buttonVariants({ variant: 'outline' }), 'gap-1.5')}
          download
        >
          <Download className="size-4" />
          Last ned CSV
        </a>
      </div>

      <form
        method="get"
        className="border-border bg-background flex flex-wrap items-end gap-4 rounded-2xl border p-5"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="from">Fra</Label>
          <Input id="from" name="from" type="date" defaultValue={from} className="w-40" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="to">Til</Label>
          <Input id="to" name="to" type="date" defaultValue={to} className="w-40" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="employee">Ansatt</Label>
          <select
            id="employee"
            name="employee"
            defaultValue={employeeId ?? ''}
            className={cn(selectClass, 'w-56')}
          >
            <option value="">Alle ansatte</option>
            {options.employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.full_name ?? 'Uten navn'}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit">Oppdater</Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Periode" value={`${dateFmt.format(new Date(from))} – ${dateFmt.format(new Date(to))}`} small />
        <SummaryCard label="Timer totalt" value={formatHours(report.totalHours)} />
        <SummaryCard label="Reell arbeidskost" value={formatNok(report.totalCost.total)} highlight />
      </div>

      {report.employees.length === 0 ? (
        <p className="text-muted-foreground text-sm">Ingen timer ført i perioden.</p>
      ) : (
        report.employees.map((emp) => (
          <section
            key={emp.profileId}
            className="border-border bg-background space-y-4 rounded-2xl border p-6"
          >
            <header className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{emp.name}</h2>
                <p className="text-muted-foreground text-xs">
                  {emp.hourlyCost} kr/t · {formatHours(emp.totalHours)} · grunnlønn{' '}
                  {formatNok(emp.totalCost.baseWage)}
                </p>
              </div>
              <span className="text-lg font-semibold tabular-nums">
                {formatNok(emp.totalCost.total)}
              </span>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-sm">
                <thead>
                  <tr className="text-muted-foreground border-border border-b text-left text-xs uppercase">
                    <th className="py-2 pr-4 font-medium tracking-wide">Dato</th>
                    <th className="py-2 pr-4 font-medium tracking-wide">Prosjekt</th>
                    <th className="py-2 pr-4 font-medium tracking-wide">Notat</th>
                    <th className="py-2 text-right font-medium tracking-wide">Timer</th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {emp.entries.map((e) => (
                    <tr key={e.id}>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {dateFmt.format(new Date(`${e.work_date}T00:00:00Z`))}
                      </td>
                      <td className="py-2 pr-4">{e.projectTitle}</td>
                      <td className="text-muted-foreground py-2 pr-4 text-xs">{e.note ?? ''}</td>
                      <td className="py-2 text-right tabular-nums">{formatHours(e.hours)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground text-xs">
              Påslag: {formatNok(emp.totalCost.holidayPay)} feriepenger ·{' '}
              {formatNok(emp.totalCost.pension)} pensjon ·{' '}
              {formatNok(emp.totalCost.employerTax)} AGA
            </p>
          </section>
        ))
      )}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  highlight,
  small,
}: {
  label: string
  value: string
  highlight?: boolean
  small?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-5',
        highlight
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-background',
      )}
    >
      <p className={cn('text-xs', highlight ? 'opacity-70' : 'text-muted-foreground')}>{label}</p>
      <p className={cn('mt-2 font-semibold tabular-nums', small ? 'text-base' : 'text-2xl')}>
        {value}
      </p>
    </div>
  )
}

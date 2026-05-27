'use client'

import { useActionState, useEffect, useRef } from 'react'

import { addTimeEntry, type TimerResult } from '@/lib/actions/timer'
import type { TimeEntryOptions } from '@/lib/queries/timer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const selectClass =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function TimeEntryForm({
  options,
  today,
}: {
  options: TimeEntryOptions
  today: string
}) {
  const [state, formAction, pending] = useActionState<TimerResult | null, FormData>(
    addTimeEntry,
    null,
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok) {
      const form = formRef.current
      if (form) {
        const hours = form.elements.namedItem('hours') as HTMLInputElement | null
        const note = form.elements.namedItem('note') as HTMLInputElement | null
        if (hours) hours.value = ''
        if (note) note.value = ''
      }
    }
  }, [state])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="border-border bg-background grid gap-4 rounded-2xl border p-5 md:grid-cols-[1.4fr_1.2fr_0.9fr_0.7fr_auto] md:items-end"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="te-project">Prosjekt</Label>
        <select id="te-project" name="project_id" required className={selectClass} defaultValue="">
          <option value="" disabled>
            Velg prosjekt
          </option>
          {options.projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="te-employee">Ansatt</Label>
        <select id="te-employee" name="profile_id" required className={selectClass} defaultValue="">
          <option value="" disabled>
            Velg ansatt
          </option>
          {options.employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.full_name ?? 'Uten navn'}
              {e.hourly_cost != null ? ` (${e.hourly_cost} kr/t)` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="te-date">Dato</Label>
        <Input id="te-date" name="work_date" type="date" defaultValue={today} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="te-hours">Timer</Label>
        <Input id="te-hours" name="hours" type="number" min="0" step="0.5" required />
      </div>

      <div className="flex flex-col items-start gap-1">
        <Button type="submit" disabled={pending}>
          {pending ? 'Fører…' : 'Før timer'}
        </Button>
      </div>

      <div className="flex flex-col gap-1.5 md:col-span-full">
        <Label htmlFor="te-note">Notat (valgfritt)</Label>
        <Input id="te-note" name="note" placeholder="Hva ble gjort?" />
        {state?.ok ? (
          <span className="text-xs text-emerald-600">{state.message}</span>
        ) : state && !state.ok ? (
          <span className="text-destructive text-xs">{state.error}</span>
        ) : null}
      </div>
    </form>
  )
}

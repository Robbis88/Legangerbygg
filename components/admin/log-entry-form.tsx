'use client'

import { useActionState, useEffect, useRef } from 'react'

import { addLogEntry, type LogResult } from '@/lib/actions/project-log'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function LogEntryForm({ projectId, today }: { projectId: string; today: string }) {
  const [state, formAction, pending] = useActionState<LogResult | null, FormData>(
    addLogEntry,
    null,
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok) formRef.current?.reset()
  }, [state])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="border-border bg-muted/30 grid gap-4 rounded-2xl border p-5 md:grid-cols-[6rem_1fr_auto] md:items-end"
    >
      <input type="hidden" name="project_id" value={projectId} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="log-date">Dato</Label>
        <Input id="log-date" name="entry_date" type="date" defaultValue={today} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="log-body">Kommentar</Label>
        <Textarea
          id="log-body"
          name="body"
          rows={2}
          placeholder="Hva ble gjort i dag? (valgfritt hvis du laster opp bilder)"
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? 'Lagrer…' : 'Legg til'}
      </Button>

      <div className="flex flex-col gap-1.5 md:col-span-full">
        <Label htmlFor="log-photos">Bilder (valgfritt — flere kan velges)</Label>
        <Input
          id="log-photos"
          name="photos"
          type="file"
          accept="image/*"
          multiple
          className="h-auto py-1.5"
        />
        {state?.ok ? (
          <span className="text-xs text-emerald-600">{state.message}</span>
        ) : state && !state.ok ? (
          <span className="text-destructive text-xs">{state.error}</span>
        ) : null}
      </div>
    </form>
  )
}

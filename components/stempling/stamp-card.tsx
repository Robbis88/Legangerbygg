'use client'

import { useActionState, useEffect, useState } from 'react'
import { Play, Square } from 'lucide-react'

import { stampIn, stampOut, type StampResult } from '@/lib/actions/stempling'
import type { ActivePunch, StampableProject } from '@/lib/queries/stempling'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const selectClass =
  'h-12 w-full rounded-xl border border-input bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${h}t ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
}

export function StampCard({
  active,
  projects,
}: {
  active: ActivePunch | null
  projects: StampableProject[]
}) {
  if (active) return <StampedInView active={active} />
  return <StampedOutView projects={projects} />
}

function StampedOutView({ projects }: { projects: StampableProject[] }) {
  const [state, formAction, pending] = useActionState<StampResult | null, FormData>(stampIn, null)

  return (
    <form action={formAction} className="border-border bg-background space-y-6 rounded-3xl border p-8">
      <div>
        <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
          Klar til å stemple inn
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Velg prosjekt</h1>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="punch-project">Prosjekt</Label>
        <select
          id="punch-project"
          name="project_id"
          required
          defaultValue=""
          className={selectClass}
        >
          <option value="" disabled>
            Velg et prosjekt
          </option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        {projects.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            Ingen aktive prosjekter — be sjefen din opprette et først.
          </p>
        ) : null}
      </div>

      {state && !state.ok ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={pending || projects.length === 0}
        className="h-16 w-full text-base"
      >
        <Play className="size-5" />
        {pending ? 'Stempler inn…' : 'Stempel inn'}
      </Button>
    </form>
  )
}

function StampedInView({ active }: { active: ActivePunch }) {
  const [state, formAction, pending] = useActionState<StampResult | null, FormData>(stampOut, null)
  const startedAt = new Date(active.started_at).getTime()
  const [elapsed, setElapsed] = useState(() => Date.now() - startedAt)

  useEffect(() => {
    const t = setInterval(() => setElapsed(Date.now() - startedAt), 1000)
    return () => clearInterval(t)
  }, [startedAt])

  const startedFmt = new Intl.DateTimeFormat('nb-NO', {
    timeStyle: 'short',
    timeZone: 'Europe/Oslo',
  }).format(new Date(startedAt))

  return (
    <form action={formAction} className="bg-foreground text-background space-y-8 rounded-3xl p-8">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">
          Stemplet inn — i gang
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{active.project_title}</h1>
        <p className="mt-2 text-sm opacity-70">Startet kl {startedFmt}</p>
      </div>

      <div className="border-background/20 border-y py-8 text-center">
        <p className="text-5xl font-semibold tabular-nums md:text-6xl">{formatElapsed(elapsed)}</p>
      </div>

      {state && !state.ok ? (
        <p className="text-sm text-rose-300" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        variant="default"
        disabled={pending}
        className="bg-background text-foreground hover:bg-background/90 h-16 w-full text-base"
      >
        <Square className="size-5" />
        {pending ? 'Stempler ut…' : 'Stempel ut'}
      </Button>
    </form>
  )
}

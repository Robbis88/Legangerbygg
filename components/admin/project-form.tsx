'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import { saveProject, deleteProject, type ProjectActionResult } from '@/lib/actions/prosjekt'
import { projectStatusValues, projectStatusLabels } from '@/lib/validators/project'
import { projectTypeValues, projectTypeLabels } from '@/lib/validators/inquiry'
import type { Database } from '@/types/supabase'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type ProjectRow = Database['public']['Tables']['projects']['Row']

const selectClass =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function ProjectForm({ project }: { project?: ProjectRow | null }) {
  const [state, formAction, pending] = useActionState<ProjectActionResult, FormData>(
    saveProject,
    null,
  )

  return (
    <div className="space-y-6">
      <form action={formAction} className="border-border bg-background space-y-6 rounded-2xl border p-6">
        {project ? <input type="hidden" name="id" value={project.id} /> : null}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="title">Tittel</Label>
            <Input id="title" name="title" defaultValue={project?.title ?? ''} required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={project?.slug ?? ''}
              placeholder="lages automatisk fra tittel"
            />
            <span className="text-muted-foreground text-xs">URL: /prosjekter/&lt;slug&gt;</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" name="address" defaultValue={project?.address ?? ''} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="type">Type</Label>
            <select id="type" name="type" defaultValue={project?.type ?? 'leilighet'} className={selectClass}>
              {projectTypeValues.map((t) => (
                <option key={t} value={t}>
                  {projectTypeLabels[t]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={project?.status ?? 'planlegging'}
              className={selectClass}
            >
              {projectStatusValues.map((s) => (
                <option key={s} value={s}>
                  {projectStatusLabels[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="start_date">Startdato</Label>
            <Input id="start_date" name="start_date" type="date" defaultValue={project?.start_date ?? ''} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="end_date">Sluttdato</Label>
            <Input id="end_date" name="end_date" type="date" defaultValue={project?.end_date ?? ''} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="estimated_hours">Estimerte timer</Label>
            <Input
              id="estimated_hours"
              name="estimated_hours"
              type="number"
              min="0"
              step="1"
              defaultValue={project?.estimated_hours ?? ''}
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="cover_image_url">Forsidebilde (URL)</Label>
            <Input
              id="cover_image_url"
              name="cover_image_url"
              defaultValue={project?.cover_image_url ?? ''}
              placeholder="https://…"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="description">Beskrivelse</Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={project?.description ?? ''}
            />
          </div>

          <label className="flex items-center gap-2 text-sm md:col-span-2" htmlFor="is_public">
            <input
              id="is_public"
              name="is_public"
              type="checkbox"
              defaultChecked={project?.is_public ?? false}
              className="size-4 accent-foreground"
            />
            Publiser på offentlig nettside
          </label>
        </div>

        {state && !state.ok ? (
          <p className="text-destructive text-sm" role="alert">
            {state.error}
          </p>
        ) : null}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? 'Lagrer…' : project ? 'Lagre endringer' : 'Opprett prosjekt'}
          </Button>
          <Link href="/admin/prosjekter" className={cn(buttonVariants({ variant: 'ghost' }))}>
            Avbryt
          </Link>
        </div>
      </form>

      {project ? (
        <form
          action={deleteProject}
          className="border-border flex items-center justify-between rounded-2xl border border-dashed p-5"
        >
          <input type="hidden" name="id" value={project.id} />
          <div>
            <p className="text-sm font-medium">Slett prosjekt</p>
            <p className="text-muted-foreground text-xs">
              Fjerner prosjektet og tilhørende bilder permanent.
            </p>
          </div>
          <Button type="submit" variant="destructive" size="sm">
            Slett
          </Button>
        </form>
      ) : null}
    </div>
  )
}

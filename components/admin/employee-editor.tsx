'use client'

import { useActionState, useState } from 'react'

import { updateEmployee, type ActionResult } from '@/lib/actions/ansatte'
import { userRoleValues, userRoleLabels } from '@/lib/validators/profile'
import type { EmployeeWithEmail } from '@/lib/queries/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const selectClass =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

function avatarUrlFor(path: string | null): string | null {
  if (!path) return null
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return base ? `${base}/storage/v1/object/public/team/${path}` : null
}

export function EmployeeEditor({ employee }: { employee: EmployeeWithEmail }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    updateEmployee,
    null,
  )
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrlFor(employee.avatar_path))

  return (
    <form
      action={formAction}
      className="border-border bg-background space-y-5 rounded-2xl border p-6"
    >
      <input type="hidden" name="id" value={employee.id} />

      {/* Header: avatar + navn/e-post */}
      <div className="flex flex-wrap items-start gap-5">
        <label
          htmlFor={`avatar-${employee.id}`}
          className="bg-muted relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-full"
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-muted-foreground absolute inset-0 flex items-center justify-center text-[10px] tracking-wider uppercase">
              Bilde
            </span>
          )}
          <input
            id={`avatar-${employee.id}`}
            type="file"
            name="avatar"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const f = e.currentTarget.files?.[0]
              if (f) setPreviewUrl(URL.createObjectURL(f))
            }}
          />
        </label>

        <div className="flex-1 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`name-${employee.id}`}>Navn</Label>
              <Input
                id={`name-${employee.id}`}
                name="full_name"
                defaultValue={employee.full_name ?? ''}
              />
              <span className="text-muted-foreground truncate text-xs">{employee.email ?? '—'}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`title-${employee.id}`}>Stillingstittel</Label>
              <Input
                id={`title-${employee.id}`}
                name="title"
                defaultValue={employee.title ?? ''}
                placeholder="f.eks. Daglig leder / Lærling"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Roll/lønn/telefon/aktiv */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`role-${employee.id}`}>Rolle</Label>
          <select
            id={`role-${employee.id}`}
            name="role"
            defaultValue={employee.role ?? 'ansatt'}
            className={selectClass}
          >
            {userRoleValues.map((r) => (
              <option key={r} value={r}>
                {userRoleLabels[r]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`cost-${employee.id}`}>Timekost (kr)</Label>
          <Input
            id={`cost-${employee.id}`}
            name="hourly_cost"
            type="number"
            min="0"
            step="1"
            defaultValue={employee.hourly_cost ?? ''}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`phone-${employee.id}`}>Telefon</Label>
          <Input
            id={`phone-${employee.id}`}
            name="phone"
            defaultValue={employee.phone ?? ''}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`sort-${employee.id}`}>Sortering på om-oss</Label>
          <Input
            id={`sort-${employee.id}`}
            name="sort_order"
            type="number"
            min="0"
            step="1"
            defaultValue={employee.sort_order ?? 0}
          />
        </div>
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`bio-${employee.id}`}>Kort bio (vises på om-oss hvis aktivert)</Label>
        <Textarea
          id={`bio-${employee.id}`}
          name="bio"
          rows={3}
          defaultValue={employee.bio ?? ''}
          placeholder="f.eks. Tømrer og grunnlegger, 5 år i faget, spesialist på oppussing."
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-5 text-sm">
          <label className="flex items-center gap-2" htmlFor={`active-${employee.id}`}>
            <input
              id={`active-${employee.id}`}
              name="active"
              type="checkbox"
              defaultChecked={employee.active}
              className="size-4 accent-foreground"
            />
            Aktiv
          </label>
          <label className="flex items-center gap-2" htmlFor={`show-${employee.id}`}>
            <input
              id={`show-${employee.id}`}
              name="show_on_about"
              type="checkbox"
              defaultChecked={employee.show_on_about ?? false}
              className="size-4 accent-foreground"
            />
            Vis på «Om oss»
          </label>
        </div>

        <div className="flex items-center gap-3">
          {state?.ok ? (
            <span className="text-xs text-emerald-600">{state.message}</span>
          ) : state && !state.ok ? (
            <span className="text-destructive text-xs">{state.error}</span>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? 'Lagrer…' : 'Lagre'}
          </Button>
        </div>
      </div>
    </form>
  )
}

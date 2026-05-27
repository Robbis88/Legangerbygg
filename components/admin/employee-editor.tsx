'use client'

import { useActionState } from 'react'

import { updateEmployee, type ActionResult } from '@/lib/actions/ansatte'
import { userRoleValues, userRoleLabels } from '@/lib/validators/profile'
import type { EmployeeWithEmail } from '@/lib/queries/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const selectClass =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function EmployeeEditor({ employee }: { employee: EmployeeWithEmail }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    updateEmployee,
    null,
  )

  return (
    <form
      action={formAction}
      className="border-border bg-background grid gap-4 rounded-2xl border p-5 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] md:items-end"
    >
      <input type="hidden" name="id" value={employee.id} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`name-${employee.id}`}>Navn</Label>
        <Input id={`name-${employee.id}`} name="full_name" defaultValue={employee.full_name ?? ''} />
        <span className="text-muted-foreground truncate text-xs">{employee.email ?? '—'}</span>
      </div>

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
          inputMode="numeric"
          defaultValue={employee.hourly_cost ?? ''}
        />
      </div>

      <label className="flex items-center gap-2 pb-2 text-sm" htmlFor={`active-${employee.id}`}>
        <input
          id={`active-${employee.id}`}
          name="active"
          type="checkbox"
          defaultChecked={employee.active}
          className="size-4 accent-foreground"
        />
        Aktiv
      </label>

      <div className="flex flex-col items-start gap-1">
        <Button type="submit" variant="outline" size="sm" disabled={pending}>
          {pending ? 'Lagrer…' : 'Lagre'}
        </Button>
        {state?.ok ? (
          <span className="text-xs text-emerald-600">{state.message}</span>
        ) : state && !state.ok ? (
          <span className="text-destructive text-xs">{state.error}</span>
        ) : null}
      </div>
    </form>
  )
}

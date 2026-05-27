'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'

import { inviteEmployee, type ActionResult } from '@/lib/actions/ansatte'
import { userRoleValues, userRoleLabels } from '@/lib/validators/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const selectClass =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function InviteEmployee() {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    inviteEmployee,
    null,
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok) formRef.current?.reset()
  }, [state])

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)} data-icon="inline-start">
        <Plus />
        Ny ansatt
      </Button>
    )
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="border-border bg-background grid w-full gap-4 rounded-2xl border p-5 md:grid-cols-2"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="inv-name">Fullt navn</Label>
        <Input id="inv-name" name="full_name" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="inv-email">E-post</Label>
        <Input id="inv-email" name="email" type="email" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="inv-phone">Telefon</Label>
        <Input id="inv-phone" name="phone" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="inv-role">Rolle</Label>
        <select id="inv-role" name="role" defaultValue="ansatt" className={selectClass}>
          {userRoleValues.map((r) => (
            <option key={r} value={r}>
              {userRoleLabels[r]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="inv-cost">Timekost (kr)</Label>
        <Input id="inv-cost" name="hourly_cost" type="number" min="0" step="1" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="inv-pass">Midlertidig passord</Label>
        <Input id="inv-pass" name="password" type="text" minLength={8} required />
      </div>

      <div className="flex items-center gap-3 md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Oppretter…' : 'Opprett ansatt'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Avbryt
        </Button>
        {state?.ok ? (
          <span className="text-sm text-emerald-600">{state.message}</span>
        ) : state && !state.ok ? (
          <span className="text-destructive text-sm">{state.error}</span>
        ) : null}
      </div>
    </form>
  )
}

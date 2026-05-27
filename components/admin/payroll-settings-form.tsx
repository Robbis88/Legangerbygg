'use client'

import { useActionState } from 'react'

import { updatePayrollSettings, type PayrollResult } from '@/lib/actions/payroll'
import type { PayrollSettings } from '@/lib/payroll'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function PayrollSettingsForm({ settings }: { settings: PayrollSettings }) {
  const [state, formAction, pending] = useActionState<PayrollResult | null, FormData>(
    updatePayrollSettings,
    null,
  )

  return (
    <form
      action={formAction}
      className="border-border bg-background flex flex-wrap items-end gap-4 rounded-2xl border p-5"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="aga">Arbeidsgiveravgift %</Label>
        <Input
          id="aga"
          name="employer_tax_pct"
          type="number"
          step="0.1"
          min="0"
          defaultValue={settings.employer_tax_pct}
          className="w-32"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ferie">Feriepenger %</Label>
        <Input
          id="ferie"
          name="holiday_pay_pct"
          type="number"
          step="0.1"
          min="0"
          defaultValue={settings.holiday_pay_pct}
          className="w-32"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="pensjon">Pensjon (OTP) %</Label>
        <Input
          id="pensjon"
          name="pension_pct"
          type="number"
          step="0.1"
          min="0"
          defaultValue={settings.pension_pct}
          className="w-32"
        />
      </div>
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? 'Lagrer…' : 'Lagre satser'}
      </Button>
      {state?.ok ? (
        <span className="text-sm text-emerald-600">{state.message}</span>
      ) : state && !state.ok ? (
        <span className="text-destructive text-sm">{state.error}</span>
      ) : null}
    </form>
  )
}

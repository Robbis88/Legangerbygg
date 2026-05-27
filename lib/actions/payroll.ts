'use server'

import { revalidatePath } from 'next/cache'

import { requireStaff } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { payrollSettingsSchema } from '@/lib/validators/time-entry'

export type PayrollResult = { ok: true; message?: string } | { ok: false; error: string }

export async function updatePayrollSettings(
  _prev: PayrollResult | null,
  formData: FormData,
): Promise<PayrollResult> {
  await requireStaff()

  const parsed = payrollSettingsSchema.safeParse({
    employer_tax_pct: formData.get('employer_tax_pct'),
    holiday_pay_pct: formData.get('holiday_pay_pct'),
    pension_pct: formData.get('pension_pct'),
  })
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ugyldige satser.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('payroll_settings')
    .update({
      employer_tax_pct: parsed.data.employer_tax_pct,
      holiday_pay_pct: parsed.data.holiday_pay_pct,
      pension_pct: parsed.data.pension_pct,
    })
    .eq('id', 1)

  if (error) {
    console.error('[updatePayrollSettings]', error)
    return { ok: false, error: 'Kunne ikke lagre satsene.' }
  }

  revalidatePath('/admin/timer')
  revalidatePath('/admin/prosjekter', 'layout')
  return { ok: true, message: 'Satser lagret.' }
}

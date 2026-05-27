'use server'

import { revalidatePath } from 'next/cache'

import { requireStaff } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateEmployeeSchema, inviteEmployeeSchema } from '@/lib/validators/profile'

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string }

function fieldError(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? 'Skjemaet inneholder feil.'
}

/** Oppdaterer rolle, timekost, navn, telefon og aktiv-status for en ansatt. */
export async function updateEmployee(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireStaff()

  const parsed = updateEmployeeSchema.safeParse({
    id: formData.get('id'),
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
    role: formData.get('role'),
    hourly_cost: formData.get('hourly_cost'),
    active: formData.get('active'),
  })
  if (!parsed.success) return { ok: false, error: fieldError(parsed.error) }

  const { id, ...fields } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fields.full_name ?? null,
      phone: fields.phone ?? null,
      role: fields.role,
      hourly_cost: fields.hourly_cost ?? null,
      active: fields.active,
    })
    .eq('id', id)

  if (error) {
    console.error('[updateEmployee]', error)
    return { ok: false, error: 'Kunne ikke lagre endringene.' }
  }

  revalidatePath('/admin/ansatte')
  return { ok: true, message: 'Lagret.' }
}

/**
 * Oppretter en ny ansatt: lager auth-bruker (service-role) med satt passord og
 * bekreftet e-post, og fyller profilen med rolle/timekost. Trigger på
 * auth.users oppretter profil-raden; vi oppdaterer den etterpå.
 */
export async function inviteEmployee(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireStaff()

  const parsed = inviteEmployeeSchema.safeParse({
    email: formData.get('email'),
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
    role: formData.get('role'),
    hourly_cost: formData.get('hourly_cost'),
    password: formData.get('password'),
  })
  if (!parsed.success) return { ok: false, error: fieldError(parsed.error) }

  const admin = createAdminClient()
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.full_name },
  })

  if (createError || !created.user) {
    console.error('[inviteEmployee] createUser', createError)
    const dup = createError?.message?.toLowerCase().includes('already')
    return { ok: false, error: dup ? 'En bruker med denne e-posten finnes allerede.' : 'Kunne ikke opprette bruker.' }
  }

  const { error: profileError } = await admin
    .from('profiles')
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone ?? null,
      role: parsed.data.role,
      hourly_cost: parsed.data.hourly_cost ?? null,
      active: true,
    })
    .eq('id', created.user.id)

  if (profileError) {
    console.error('[inviteEmployee] profile update', profileError)
    return { ok: false, error: 'Bruker opprettet, men profilen kunne ikke oppdateres.' }
  }

  revalidatePath('/admin/ansatte')
  return { ok: true, message: `${parsed.data.full_name} er lagt til.` }
}

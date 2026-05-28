'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAdminAccess } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export type StampResult = { ok: true; message?: string } | { ok: false; error: string }

const projectIdSchema = z.string().uuid('Velg et prosjekt')

export async function stampIn(_prev: StampResult | null, formData: FormData): Promise<StampResult> {
  const session = await requireAdminAccess()

  const parsed = projectIdSchema.safeParse(formData.get('project_id'))
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Mangler prosjekt' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('active_punches')
    .insert({ profile_id: session.userId, project_id: parsed.data })

  if (error) {
    if (error.code === '23505') {
      return { ok: false, error: 'Du er allerede stemplet inn — stempel ut først.' }
    }
    console.error('[stampIn]', error)
    return { ok: false, error: 'Kunne ikke stemple inn.' }
  }

  revalidatePath('/stempling')
  return { ok: true, message: 'Stemplet inn.' }
}

export async function stampOut(_prev: StampResult | null, _formData: FormData): Promise<StampResult> {
  const session = await requireAdminAccess()
  const supabase = await createClient()

  const { data: active } = await supabase
    .from('active_punches')
    .select('id, project_id, started_at')
    .eq('profile_id', session.userId)
    .maybeSingle()
  if (!active) return { ok: false, error: 'Du er ikke stemplet inn.' }

  const startedAt = new Date(active.started_at)
  const endedAt = new Date()
  const diffHours = (endedAt.getTime() - startedAt.getTime()) / 1000 / 3600
  // Bygg en time-verdi mellom 0.01 og 24 (eksisterende check-constraint).
  const hours = Math.min(24, Math.max(0.01, Math.round(diffHours * 100) / 100))
  // Bruk Europe/Oslo for arbeidsdato.
  const workDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Oslo' }).format(startedAt)

  const { error: insErr } = await supabase.from('time_entries').insert({
    profile_id: session.userId,
    project_id: active.project_id,
    work_date: workDate,
    hours,
    note: 'Stemplet',
  })
  if (insErr) {
    console.error('[stampOut.insert]', insErr)
    return { ok: false, error: 'Kunne ikke lagre timene. Prøv igjen.' }
  }

  const { error: delErr } = await supabase
    .from('active_punches')
    .delete()
    .eq('profile_id', session.userId)
  if (delErr) console.error('[stampOut.delete]', delErr)

  revalidatePath('/stempling')
  revalidatePath('/admin/timer')
  return { ok: true, message: `Stemplet ut — ${hours} timer ført.` }
}

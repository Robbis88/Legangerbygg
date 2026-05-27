'use server'

import { revalidatePath } from 'next/cache'

import { requireStaff } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { timeEntrySchema } from '@/lib/validators/time-entry'

export type TimerResult = { ok: true; message?: string } | { ok: false; error: string }

export async function addTimeEntry(_prev: TimerResult | null, formData: FormData): Promise<TimerResult> {
  await requireStaff()

  const parsed = timeEntrySchema.safeParse({
    project_id: formData.get('project_id'),
    profile_id: formData.get('profile_id'),
    work_date: formData.get('work_date'),
    hours: formData.get('hours'),
    note: formData.get('note'),
  })
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Skjemaet inneholder feil.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('time_entries').insert({
    project_id: parsed.data.project_id,
    profile_id: parsed.data.profile_id,
    work_date: parsed.data.work_date,
    hours: parsed.data.hours,
    note: parsed.data.note ?? null,
  })

  if (error) {
    console.error('[addTimeEntry]', error)
    return { ok: false, error: 'Kunne ikke lagre timeføringen.' }
  }

  revalidatePath('/admin/timer')
  return { ok: true, message: 'Timer ført.' }
}

export async function deleteTimeEntry(formData: FormData): Promise<void> {
  await requireStaff()
  const id = formData.get('id')
  if (typeof id !== 'string') return

  const supabase = await createClient()
  const { error } = await supabase.from('time_entries').delete().eq('id', id)
  if (error) console.error('[deleteTimeEntry]', error)

  revalidatePath('/admin/timer')
}

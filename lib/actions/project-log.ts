'use server'

import { revalidatePath } from 'next/cache'

import { requireStaff } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { logEntrySchema } from '@/lib/validators/project-log'
import { DOCUMENTS_BUCKET } from '@/lib/queries/documents'

export type LogResult = { ok: true; message?: string } | { ok: false; error: string }

const MAX_BYTES_PER_FILE = 15 * 1024 * 1024
const ALLOWED_IMG = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

export async function addLogEntry(_prev: LogResult | null, formData: FormData): Promise<LogResult> {
  const session = await requireStaff()

  const parsed = logEntrySchema.safeParse({
    project_id: formData.get('project_id'),
    entry_date: formData.get('entry_date'),
    body: formData.get('body'),
  })
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Feil i skjema' }

  const files = formData.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0)
  if ((parsed.data.body == null || parsed.data.body === '') && files.length === 0) {
    return { ok: false, error: 'Skriv en kommentar eller last opp minst ett bilde.' }
  }
  for (const f of files) {
    if (f.size > MAX_BYTES_PER_FILE) return { ok: false, error: `«${f.name}» er for stor (maks 15 MB).` }
    if (f.type && !ALLOWED_IMG.includes(f.type)) {
      return { ok: false, error: `«${f.name}»: bare JPG/PNG/WEBP/HEIC tillates.` }
    }
  }

  const admin = createAdminClient()
  const paths: string[] = []
  for (const file of files) {
    const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : 'jpg'
    const path = `${parsed.data.project_id}/log/${crypto.randomUUID()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    const { error } = await admin.storage.from(DOCUMENTS_BUCKET).upload(path, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    })
    if (error) {
      console.error('[addLogEntry] upload', error)
      // cleanup tidligere
      if (paths.length) await admin.storage.from(DOCUMENTS_BUCKET).remove(paths)
      return { ok: false, error: 'Opplasting av bilde feilet.' }
    }
    paths.push(path)
  }

  const { error: dbError } = await admin.from('project_log').insert({
    project_id: parsed.data.project_id,
    author_id: session.userId,
    author_name: session.profile.full_name,
    entry_date: parsed.data.entry_date,
    body: parsed.data.body ?? '',
    photo_paths: paths,
  })
  if (dbError) {
    if (paths.length) await admin.storage.from(DOCUMENTS_BUCKET).remove(paths)
    console.error('[addLogEntry] db', dbError)
    return { ok: false, error: 'Kunne ikke lagre loggføringen.' }
  }

  revalidatePath(`/admin/prosjekter/${parsed.data.project_id}`)
  return { ok: true, message: 'Lagt til.' }
}

export async function deleteLogEntry(formData: FormData): Promise<void> {
  await requireStaff()
  const id = formData.get('id')
  if (typeof id !== 'string') return

  const admin = createAdminClient()
  const { data } = await admin
    .from('project_log')
    .select('photo_paths, project_id')
    .eq('id', id)
    .single()

  if (data?.photo_paths?.length) {
    await admin.storage.from(DOCUMENTS_BUCKET).remove(data.photo_paths)
  }
  await admin.from('project_log').delete().eq('id', id)

  if (data?.project_id) revalidatePath(`/admin/prosjekter/${data.project_id}`)
}

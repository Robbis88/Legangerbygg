'use server'

import { revalidatePath } from 'next/cache'

import { requireStaff } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { documentMetaSchema } from '@/lib/validators/document'
import { DOCUMENTS_BUCKET } from '@/lib/queries/documents'

export type DocResult = { ok: true; message?: string } | { ok: false; error: string }

const MAX_BYTES = 15 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']

export async function uploadDocument(_prev: DocResult | null, formData: FormData): Promise<DocResult> {
  await requireStaff()

  const meta = documentMetaSchema.safeParse({
    project_id: formData.get('project_id'),
    kind: formData.get('kind'),
    supplier: formData.get('supplier'),
    amount: formData.get('amount'),
    doc_date: formData.get('doc_date'),
    note: formData.get('note'),
  })
  if (!meta.success) {
    return { ok: false, error: meta.error.issues[0]?.message ?? 'Skjemaet inneholder feil.' }
  }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Velg en fil (bilde eller PDF).' }
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: 'Filen er for stor (maks 15 MB).' }
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return { ok: false, error: 'Kun bilder (JPG/PNG/WEBP/HEIC) eller PDF.' }
  }

  const admin = createAdminClient()
  const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : 'bin'
  const path = `${meta.data.project_id}/${crypto.randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await admin.storage.from(DOCUMENTS_BUCKET).upload(path, buffer, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  })
  if (uploadError) {
    console.error('[uploadDocument] storage', uploadError)
    return { ok: false, error: 'Opplasting feilet. Prøv igjen.' }
  }

  const { error: dbError } = await admin.from('project_documents').insert({
    project_id: meta.data.project_id,
    kind: meta.data.kind,
    supplier: meta.data.supplier ?? null,
    amount: meta.data.amount ?? null,
    doc_date: meta.data.doc_date ?? null,
    note: meta.data.note ?? null,
    storage_path: path,
    file_name: file.name,
    mime_type: file.type || null,
  })
  if (dbError) {
    console.error('[uploadDocument] db', dbError)
    await admin.storage.from(DOCUMENTS_BUCKET).remove([path])
    return { ok: false, error: 'Kunne ikke lagre dokumentet.' }
  }

  revalidatePath(`/admin/prosjekter/${meta.data.project_id}`)
  return { ok: true, message: 'Dokument lastet opp.' }
}

export async function deleteDocument(formData: FormData): Promise<void> {
  await requireStaff()
  const id = formData.get('id')
  if (typeof id !== 'string') return

  const admin = createAdminClient()
  const { data } = await admin
    .from('project_documents')
    .select('storage_path, project_id')
    .eq('id', id)
    .single()

  if (data?.storage_path) {
    await admin.storage.from(DOCUMENTS_BUCKET).remove([data.storage_path])
  }
  await admin.from('project_documents').delete().eq('id', id)

  if (data?.project_id) revalidatePath(`/admin/prosjekter/${data.project_id}`)
}

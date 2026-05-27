import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/types/supabase'

export const DOCUMENTS_BUCKET = 'prosjektdok'

export type ProjectDocument = {
  id: string
  kind: Database['public']['Enums']['document_kind']
  supplier: string | null
  amount: number | null
  doc_date: string | null
  note: string | null
  file_name: string | null
  mime_type: string | null
  url: string | null
}

/**
 * Henter dokumenter for et prosjekt med signerte URLer (1 t). Bruker
 * service-role siden botta er privat — siden er allerede tilgangsbeskyttet.
 */
export async function getProjectDocuments(projectId: string): Promise<ProjectDocument[]> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('project_documents')
    .select('*')
    .eq('project_id', projectId)
    .order('doc_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  const rows = data ?? []
  const urlByPath = new Map<string, string>()
  if (rows.length > 0) {
    const { data: signed } = await admin.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrls(
        rows.map((r) => r.storage_path),
        3600,
      )
    for (const s of signed ?? []) {
      if (s.path && s.signedUrl) urlByPath.set(s.path, s.signedUrl)
    }
  }

  return rows.map((r) => ({
    id: r.id,
    kind: r.kind,
    supplier: r.supplier,
    amount: r.amount == null ? null : Number(r.amount),
    doc_date: r.doc_date,
    note: r.note,
    file_name: r.file_name,
    mime_type: r.mime_type,
    url: urlByPath.get(r.storage_path) ?? null,
  }))
}

export async function getProjectMaterialTotal(projectId: string): Promise<number> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('project_documents')
    .select('amount')
    .eq('project_id', projectId)
  return (data ?? []).reduce((sum, r) => sum + (r.amount == null ? 0 : Number(r.amount)), 0)
}

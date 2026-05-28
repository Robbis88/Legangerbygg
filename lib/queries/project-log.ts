import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { DOCUMENTS_BUCKET } from '@/lib/queries/documents'

export type LogPhoto = { path: string; url: string | null }

export type LogEntry = {
  id: string
  entry_date: string
  body: string
  author_name: string | null
  created_at: string
  photos: LogPhoto[]
}

/** Henter logg for et prosjekt med signerte URLer paa bildene (1 t). */
export async function getProjectLog(projectId: string): Promise<LogEntry[]> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('project_log')
    .select('id, entry_date, body, author_name, created_at, photo_paths')
    .eq('project_id', projectId)
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false })

  const rows = data ?? []
  const allPaths = rows.flatMap((r) => r.photo_paths ?? [])
  const urlByPath = new Map<string, string>()
  if (allPaths.length > 0) {
    const { data: signed } = await admin.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrls(allPaths, 3600)
    for (const s of signed ?? []) {
      if (s.path && s.signedUrl) urlByPath.set(s.path, s.signedUrl)
    }
  }

  return rows.map((r) => ({
    id: r.id,
    entry_date: r.entry_date,
    body: r.body,
    author_name: r.author_name,
    created_at: r.created_at,
    photos: (r.photo_paths ?? []).map((p) => ({ path: p, url: urlByPath.get(p) ?? null })),
  }))
}

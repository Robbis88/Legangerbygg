import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

function firstRel<T>(rel: T | T[] | null): T | null {
  return Array.isArray(rel) ? (rel[0] ?? null) : (rel ?? null)
}

export type ActivePunch = {
  id: string
  project_id: string
  project_title: string
  started_at: string
}

export async function getActivePunch(profileId: string): Promise<ActivePunch | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('active_punches')
    .select('id, project_id, started_at, projects(title)')
    .eq('profile_id', profileId)
    .maybeSingle()
  if (!data) return null
  const project = firstRel(data.projects as { title: string } | { title: string }[] | null)
  return {
    id: data.id,
    project_id: data.project_id,
    project_title: project?.title ?? 'Ukjent prosjekt',
    started_at: data.started_at,
  }
}

export type StampHistoryItem = {
  id: string
  work_date: string
  hours: number
  project_title: string
  note: string | null
}

export async function getRecentStamps(profileId: string, limit = 10): Promise<StampHistoryItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('time_entries')
    .select('id, work_date, hours, note, projects(title)')
    .eq('profile_id', profileId)
    .order('work_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data ?? []).map((e) => {
    const p = firstRel(e.projects as { title: string } | { title: string }[] | null)
    return {
      id: e.id,
      work_date: e.work_date,
      hours: Number(e.hours),
      note: e.note,
      project_title: p?.title ?? 'Ukjent prosjekt',
    }
  })
}

export type StampableProject = { id: string; title: string }

/** Prosjekter ansatte kan stemple paa: alt utenom 'ferdig'. */
export async function getStampableProjects(): Promise<StampableProject[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('id, title, status')
    .neq('status', 'ferdig')
    .order('updated_at', { ascending: false })
  return (data ?? []).map((p) => ({ id: p.id, title: p.title }))
}

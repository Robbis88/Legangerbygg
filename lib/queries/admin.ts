import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/types/supabase'

export type AdminProject = Pick<
  Database['public']['Tables']['projects']['Row'],
  'id' | 'title' | 'slug' | 'type' | 'status' | 'address' | 'is_public' | 'published_at' | 'estimated_hours' | 'updated_at'
>

export type AdminProfile = Database['public']['Tables']['profiles']['Row']

/**
 * Admin-spørringer kjører med innlogget brukers sesjon (RLS gjelder; en aktiv
 * intern bruker passerer has_admin_access). Ikke cachet — alltid fersk.
 */
export async function getDashboardStats() {
  const supabase = await createClient()
  const [projects, employees, inquiries] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('active', true),
    supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'ny'),
  ])

  return {
    projects: projects.count ?? 0,
    employees: employees.count ?? 0,
    newInquiries: inquiries.count ?? 0,
  }
}

export async function getAdminProjects(): Promise<AdminProject[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select(
      'id, title, slug, type, status, address, is_public, published_at, estimated_hours, updated_at',
    )
    .order('updated_at', { ascending: false })
  return data ?? []
}

export async function getAdminProjectById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('*').eq('id', id).maybeSingle()
  return data
}

export async function getAdminProfiles(): Promise<AdminProfile[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })
  return data ?? []
}

export type EmployeeWithEmail = AdminProfile & { email: string | null }

/** Profiler beriket med e-post fra auth.users (kun synlig for service-role). */
export async function getEmployees(): Promise<EmployeeWithEmail[]> {
  const profiles = await getAdminProfiles()
  const admin = createAdminClient()
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 })
  const emailById = new Map((list?.users ?? []).map((u) => [u.id, u.email ?? null]))
  return profiles.map((p) => ({ ...p, email: emailById.get(p.id) ?? null }))
}

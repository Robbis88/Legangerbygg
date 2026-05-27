import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  DEFAULT_PAYROLL,
  computeLaborCost,
  sumLaborCost,
  type PayrollSettings,
  type LaborCost,
} from '@/lib/payroll'

export async function getPayrollSettings(): Promise<PayrollSettings> {
  const supabase = await createClient()
  const { data } = await supabase.from('payroll_settings').select('*').eq('id', 1).maybeSingle()
  if (!data) return DEFAULT_PAYROLL
  return {
    employer_tax_pct: Number(data.employer_tax_pct),
    holiday_pay_pct: Number(data.holiday_pay_pct),
    pension_pct: Number(data.pension_pct),
  }
}

export type TimeEntryOptions = {
  projects: { id: string; title: string }[]
  employees: { id: string; full_name: string | null; hourly_cost: number | null }[]
}

export async function getTimeEntryOptions(): Promise<TimeEntryOptions> {
  const supabase = await createClient()
  const [projectsRes, profilesRes] = await Promise.all([
    supabase.from('projects').select('id, title').order('updated_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('id, full_name, hourly_cost')
      .eq('active', true)
      .order('full_name', { ascending: true }),
  ])
  return {
    projects: projectsRes.data ?? [],
    employees: (profilesRes.data ?? []).map((p) => ({
      id: p.id,
      full_name: p.full_name,
      hourly_cost: p.hourly_cost == null ? null : Number(p.hourly_cost),
    })),
  }
}

export type RecentTimeEntry = {
  id: string
  work_date: string
  hours: number
  note: string | null
  projectTitle: string
  employeeName: string
}

function firstRel<T>(rel: T | T[] | null): T | null {
  return Array.isArray(rel) ? (rel[0] ?? null) : (rel ?? null)
}

export async function getRecentTimeEntries(limit = 25): Promise<RecentTimeEntry[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('time_entries')
    .select('id, work_date, hours, note, projects(title), profiles(full_name)')
    .order('work_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data ?? []).map((e) => {
    const project = firstRel(e.projects as { title: string } | { title: string }[] | null)
    const profile = firstRel(e.profiles as { full_name: string | null } | { full_name: string | null }[] | null)
    return {
      id: e.id,
      work_date: e.work_date,
      hours: Number(e.hours),
      note: e.note,
      projectTitle: project?.title ?? 'Ukjent prosjekt',
      employeeName: profile?.full_name ?? 'Ukjent',
    }
  })
}

export type ProjectLaborLine = {
  profileId: string
  name: string
  hours: number
  hourlyCost: number
  cost: LaborCost
}

export type ProjectLaborSummary = {
  settings: PayrollSettings
  lines: ProjectLaborLine[]
  total: LaborCost
}

export async function getProjectLaborSummary(projectId: string): Promise<ProjectLaborSummary> {
  const supabase = await createClient()
  const settings = await getPayrollSettings()
  const { data } = await supabase
    .from('time_entries')
    .select('hours, profile_id, profiles(full_name, hourly_cost)')
    .eq('project_id', projectId)

  const grouped = new Map<string, { name: string; hourlyCost: number; hours: number }>()
  for (const e of data ?? []) {
    const profile = firstRel(
      e.profiles as { full_name: string | null; hourly_cost: number | null } | { full_name: string | null; hourly_cost: number | null }[] | null,
    )
    const current = grouped.get(e.profile_id) ?? {
      name: profile?.full_name ?? 'Ukjent',
      hourlyCost: profile?.hourly_cost == null ? 0 : Number(profile.hourly_cost),
      hours: 0,
    }
    current.hours += Number(e.hours)
    grouped.set(e.profile_id, current)
  }

  const lines: ProjectLaborLine[] = [...grouped.entries()].map(([profileId, v]) => ({
    profileId,
    name: v.name,
    hours: v.hours,
    hourlyCost: v.hourlyCost,
    cost: computeLaborCost(v.hourlyCost, v.hours, settings),
  }))
  lines.sort((a, b) => b.cost.total - a.cost.total)

  return { settings, lines, total: sumLaborCost(lines.map((l) => l.cost)) }
}

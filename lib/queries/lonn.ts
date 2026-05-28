import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { computeLaborCost, sumLaborCost, type LaborCost, type PayrollSettings } from '@/lib/payroll'
import { getPayrollSettings } from '@/lib/queries/timer'

export type LonnEntry = {
  id: string
  work_date: string
  hours: number
  note: string | null
  projectTitle: string
}

export type LonnEmployee = {
  profileId: string
  name: string
  hourlyCost: number
  entries: LonnEntry[]
  totalHours: number
  totalCost: LaborCost
}

export type LonnReport = {
  settings: PayrollSettings
  from: string
  to: string
  employees: LonnEmployee[]
  totalHours: number
  totalCost: LaborCost
}

function firstRel<T>(rel: T | T[] | null): T | null {
  return Array.isArray(rel) ? (rel[0] ?? null) : (rel ?? null)
}

export async function getLonnReport({
  from,
  to,
  employeeId,
}: {
  from: string
  to: string
  employeeId?: string | null
}): Promise<LonnReport> {
  const supabase = await createClient()
  const settings = await getPayrollSettings()

  let query = supabase
    .from('time_entries')
    .select(
      'id, work_date, hours, note, profile_id, projects(title), profiles(full_name, hourly_cost)',
    )
    .gte('work_date', from)
    .lte('work_date', to)
    .order('work_date', { ascending: true })

  if (employeeId) query = query.eq('profile_id', employeeId)

  const { data } = await query
  const rows = data ?? []

  const grouped = new Map<string, LonnEmployee>()
  for (const e of rows) {
    const project = firstRel(
      e.projects as { title: string } | { title: string }[] | null,
    )
    const profile = firstRel(
      e.profiles as
        | { full_name: string | null; hourly_cost: number | null }
        | { full_name: string | null; hourly_cost: number | null }[]
        | null,
    )
    const current =
      grouped.get(e.profile_id) ??
      ({
        profileId: e.profile_id,
        name: profile?.full_name ?? 'Ukjent',
        hourlyCost: profile?.hourly_cost == null ? 0 : Number(profile.hourly_cost),
        entries: [],
        totalHours: 0,
        totalCost: { hours: 0, baseWage: 0, holidayPay: 0, pension: 0, employerTax: 0, total: 0 },
      } satisfies LonnEmployee)

    const hours = Number(e.hours)
    current.entries.push({
      id: e.id,
      work_date: e.work_date,
      hours,
      note: e.note,
      projectTitle: project?.title ?? 'Ukjent prosjekt',
    })
    current.totalHours += hours
    grouped.set(e.profile_id, current)
  }

  const employees: LonnEmployee[] = [...grouped.values()].map((emp) => ({
    ...emp,
    totalCost: computeLaborCost(emp.hourlyCost, emp.totalHours, settings),
  }))
  employees.sort((a, b) => a.name.localeCompare(b.name, 'nb'))

  return {
    settings,
    from,
    to,
    employees,
    totalHours: employees.reduce((s, e) => s + e.totalHours, 0),
    totalCost: sumLaborCost(employees.map((e) => e.totalCost)),
  }
}

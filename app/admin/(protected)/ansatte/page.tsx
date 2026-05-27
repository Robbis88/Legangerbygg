import type { Metadata } from 'next'

import { getEmployees } from '@/lib/queries/admin'
import { EmployeeEditor } from '@/components/admin/employee-editor'
import { InviteEmployee } from '@/components/admin/invite-employee'

export const metadata: Metadata = {
  title: 'Ansatte',
  robots: { index: false, follow: false },
}

export default async function AnsattePage() {
  const employees = await getEmployees()

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Ansatte</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Roller, timekost og tilgang. Timekost brukes til å beregne arbeidskost per prosjekt.
          </p>
        </div>
        <InviteEmployee />
      </div>

      <div className="space-y-4">
        {employees.length === 0 ? (
          <p className="text-muted-foreground text-sm">Ingen ansatte ennå.</p>
        ) : (
          employees.map((employee) => <EmployeeEditor key={employee.id} employee={employee} />)
        )}
      </div>
    </div>
  )
}

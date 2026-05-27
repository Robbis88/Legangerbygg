import type { Metadata } from 'next'

import { ProjectForm } from '@/components/admin/project-form'

export const metadata: Metadata = {
  title: 'Nytt prosjekt',
  robots: { index: false, follow: false },
}

export default function NyttProsjektPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">Nytt prosjekt</h1>
      <ProjectForm />
    </div>
  )
}

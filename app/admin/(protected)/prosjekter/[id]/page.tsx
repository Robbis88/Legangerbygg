import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getAdminProjectById } from '@/lib/queries/admin'
import { ProjectForm } from '@/components/admin/project-form'
import { ProjectEconomy } from '@/components/admin/project-economy'
import { ProjectDocuments } from '@/components/admin/project-documents'
import { ProjectLog } from '@/components/admin/project-log'

export const metadata: Metadata = {
  title: 'Rediger prosjekt',
  robots: { index: false, follow: false },
}

export default async function RedigerProsjektPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getAdminProjectById(id)
  if (!project) notFound()

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">Rediger prosjekt</h1>
      <ProjectForm project={project} />
      <ProjectLog projectId={project.id} />
      <ProjectEconomy projectId={project.id} />
      <ProjectDocuments projectId={project.id} />
    </div>
  )
}

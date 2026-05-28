import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getHmsArticleById } from '@/lib/queries/hms'
import { HmsForm } from '@/components/admin/hms-form'

export const metadata: Metadata = {
  title: 'Rediger HMS-artikkel',
  robots: { index: false, follow: false },
}

export default async function RedigerHmsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const article = await getHmsArticleById(id)
  if (!article) notFound()

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">{article.title}</h1>
      <HmsForm article={article} />
    </div>
  )
}

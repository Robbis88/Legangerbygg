import type { Metadata } from 'next'

import { HmsForm } from '@/components/admin/hms-form'

export const metadata: Metadata = {
  title: 'Ny HMS-artikkel',
  robots: { index: false, follow: false },
}

export default function NyHmsArtikkelPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">Ny HMS-artikkel</h1>
      <HmsForm />
    </div>
  )
}

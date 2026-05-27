import { Suspense } from 'react'

import { AdminShell } from '@/components/admin/admin-shell'

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  )
}

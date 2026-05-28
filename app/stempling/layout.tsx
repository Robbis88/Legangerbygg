import { Suspense } from 'react'

import { StemplingShell } from '@/components/stempling/stempling-shell'

export default function StemplingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <StemplingShell>{children}</StemplingShell>
    </Suspense>
  )
}

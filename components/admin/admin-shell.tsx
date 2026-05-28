import { redirect } from 'next/navigation'

import { requireAdminAccess } from '@/lib/auth'
import { AdminNav } from '@/components/admin/admin-nav'

/**
 * Server-komponent som håndhever tilgang (requireAdminAccess) og rammer inn
 * admin-området med navigasjon. Wrappes i <Suspense> av layouten siden den
 * leser cookies (dynamisk under Cache Components).
 *
 * Ansatte sendes til /stempling — de skal bare stemple inn og ut, ikke
 * administrere systemet.
 */
export async function AdminShell({ children }: { children: React.ReactNode }) {
  const { profile, email } = await requireAdminAccess()
  if (profile.role === 'ansatt') redirect('/stempling')

  return (
    <div className="bg-muted/20 min-h-screen print:bg-white">
      <AdminNav fullName={profile.full_name} role={profile.role} email={email} />
      <main className="mx-auto max-w-6xl px-6 py-10 print:max-w-none print:p-0">{children}</main>
    </div>
  )
}

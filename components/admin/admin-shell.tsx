import { requireAdminAccess } from '@/lib/auth'
import { AdminNav } from '@/components/admin/admin-nav'

/**
 * Server-komponent som håndhever tilgang (requireAdminAccess) og rammer inn
 * admin-området med navigasjon. Wrappes i <Suspense> av layouten siden den
 * leser cookies (dynamisk under Cache Components).
 */
export async function AdminShell({ children }: { children: React.ReactNode }) {
  const { profile, email } = await requireAdminAccess()

  return (
    <div className="bg-muted/20 min-h-screen print:bg-white">
      <AdminNav fullName={profile.full_name} role={profile.role} email={email} />
      <main className="mx-auto max-w-6xl px-6 py-10 print:max-w-none print:p-0">{children}</main>
    </div>
  )
}

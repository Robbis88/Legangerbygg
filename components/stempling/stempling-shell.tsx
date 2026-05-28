import Link from 'next/link'

import { requireAdminAccess } from '@/lib/auth'
import { signOut } from '@/lib/actions/auth'
import { Logomark } from '@/components/logo'
import { Button } from '@/components/ui/button'

export async function StemplingShell({ children }: { children: React.ReactNode }) {
  const { profile, email } = await requireAdminAccess()

  return (
    <div className="bg-muted/20 min-h-screen">
      <header className="border-border bg-background sticky top-0 z-30 border-b">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-6">
          <Link href="/stempling" className="flex items-center gap-2.5" aria-label="Stempling">
            <Logomark className="h-7 w-7" decorative />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Stempling</span>
          </Link>
          <div className="flex items-center gap-3">
            {profile.role !== 'ansatt' ? (
              <Link
                href="/admin"
                className="text-foreground/70 hover:text-foreground hidden text-sm font-medium transition-colors sm:inline"
              >
                Til admin →
              </Link>
            ) : null}
            <div className="hidden text-right sm:block">
              <p className="text-sm leading-tight font-medium">{profile.full_name ?? email}</p>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Logg ut
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  )
}

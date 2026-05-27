'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { signOut } from '@/lib/actions/auth'
import { Logomark } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/lib/auth'

const navItems = [
  { href: '/admin', label: 'Oversikt' },
  { href: '/admin/prosjekter', label: 'Prosjekter' },
  { href: '/admin/timer', label: 'Timer' },
  { href: '/admin/ansatte', label: 'Ansatte' },
]

const roleLabels: Record<UserRole, string> = {
  eier: 'Eier',
  ansatt: 'Ansatt',
  regnskap: 'Regnskap',
  visning: 'Visning',
}

export function AdminNav({
  fullName,
  role,
  email,
}: {
  fullName: string | null
  role: UserRole | null
  email: string | null
}) {
  const pathname = usePathname()

  return (
    <header className="border-border bg-background sticky top-0 z-30 border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2.5" aria-label="Driftssystem">
            <Logomark className="h-7 w-7" decorative />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Drift</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const active =
                item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-muted text-foreground'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/60',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm leading-tight font-medium">{fullName ?? email}</p>
            <p className="text-muted-foreground text-xs">{role ? roleLabels[role] : '—'}</p>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Logg ut
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}

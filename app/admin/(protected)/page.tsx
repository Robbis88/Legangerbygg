import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, FolderKanban, Users, Inbox } from 'lucide-react'

import { getDashboardStats } from '@/lib/queries/admin'

export const metadata: Metadata = {
  title: 'Oversikt',
  robots: { index: false, follow: false },
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const cards = [
    {
      label: 'Prosjekter',
      value: stats.projects,
      href: '/admin/prosjekter',
      icon: FolderKanban,
    },
    { label: 'Aktive ansatte', value: stats.employees, href: '/admin/ansatte', icon: Users },
    {
      label: 'Nye henvendelser',
      value: stats.newInquiries,
      href: '/admin/henvendelser',
      icon: Inbox,
    },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Oversikt</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Velkommen til driftssystemet. Her får du kontroll på prosjekter, ansatte og økonomi.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border-border bg-background hover:border-foreground/20 group rounded-2xl border p-6 transition-colors"
          >
            <div className="flex items-center justify-between">
              <card.icon className="text-muted-foreground h-5 w-5" />
              <ArrowRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-6 text-4xl font-semibold tabular-nums">{card.value}</p>
            <p className="text-muted-foreground mt-1 text-sm">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="border-border bg-background rounded-2xl border p-6">
        <h2 className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
          Kommer senere
        </h2>
        <p className="text-foreground/80 mt-3 text-sm leading-relaxed">
          Timeføring per prosjekt, kvitteringer og faktura, tilbud fra henvendelser og
          HMS-håndbok bygges i neste faser. Fundamentet — innlogging, roller, ansatte og
          prosjekter — er på plass nå.
        </p>
      </div>
    </div>
  )
}

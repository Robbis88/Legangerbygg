import Link from 'next/link'
import type { Metadata } from 'next'
import { Plus } from 'lucide-react'

import { getHmsArticles } from '@/lib/queries/hms'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'HMS-håndbok',
  robots: { index: false, follow: false },
}

export default async function HmsPage() {
  const articles = await getHmsArticles()

  // Grupper etter kategori (null → «Uten kategori»)
  const grouped = new Map<string, typeof articles>()
  for (const a of articles) {
    const key = a.category ?? 'Uten kategori'
    const list = grouped.get(key) ?? []
    list.push(a)
    grouped.set(key, list)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">HMS-håndbok</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Prosedyrer, sjekklister og rutiner for tømrerfaget. Bare innloggede ansatte ser
            innholdet.
          </p>
        </div>
        <Link href="/admin/hms/ny" className={cn(buttonVariants(), 'gap-1.5')}>
          <Plus className="size-4" />
          Ny artikkel
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Ingen artikler enda. Opprett den første — f.eks. en HMS-policy eller sjekkliste for
          verneutstyr.
        </p>
      ) : (
        <div className="space-y-8">
          {[...grouped.entries()].map(([category, list]) => (
            <section key={category} className="space-y-3">
              <h2 className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
                {category}
              </h2>
              <div className="border-border divide-border bg-background divide-y overflow-hidden rounded-2xl border">
                {list.map((a) => (
                  <Link
                    key={a.id}
                    href={`/admin/hms/${a.id}`}
                    className="hover:bg-muted/50 flex items-center justify-between gap-4 px-5 py-4 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{a.title}</p>
                      {a.body ? (
                        <p className="text-muted-foreground line-clamp-1 text-xs">
                          {a.body.split('\n')[0]}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase shrink-0',
                        a.published
                          ? 'bg-emerald-500/15 text-emerald-700'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {a.published ? 'Publisert' : 'Utkast'}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

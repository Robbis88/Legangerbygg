import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { getQuotes } from '@/lib/queries/quotes'
import { quoteStatusLabels } from '@/lib/quote'
import { formatNok } from '@/lib/payroll'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Tilbud',
  robots: { index: false, follow: false },
}

const statusStyles: Record<string, string> = {
  utkast: 'bg-muted text-muted-foreground',
  sendt: 'bg-blue-500/15 text-blue-700',
  akseptert: 'bg-emerald-500/15 text-emerald-700',
  avslaatt: 'bg-rose-500/15 text-rose-700',
}

export default async function TilbudPage() {
  const quotes = await getQuotes()

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tilbud</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {quotes.length} {quotes.length === 1 ? 'tilbud' : 'tilbud'} totalt.
          </p>
        </div>
        <Link href="/admin/tilbud/ny" className={cn(buttonVariants(), 'gap-1.5')}>
          <Plus className="size-4" />
          Nytt tilbud
        </Link>
      </div>

      {quotes.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Ingen tilbud ennå. Lag et fra en henvendelse eller direkte herfra.
        </p>
      ) : (
        <div className="border-border divide-border bg-background divide-y overflow-hidden rounded-2xl border">
          {quotes.map((q) => (
            <Link
              key={q.id}
              href={`/admin/tilbud/${q.id}`}
              className="hover:bg-muted/50 flex items-center justify-between gap-4 px-5 py-4 transition-colors"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  <span className="text-muted-foreground font-mono text-xs">
                    {q.quote_number ?? '—'}
                  </span>{' '}
                  · {q.title}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {q.customer_name} · {q.itemCount} {q.itemCount === 1 ? 'linje' : 'linjer'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-medium tabular-nums">{formatNok(q.total)}</span>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase',
                    statusStyles[q.status] ?? 'bg-muted',
                  )}
                >
                  {quoteStatusLabels[q.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

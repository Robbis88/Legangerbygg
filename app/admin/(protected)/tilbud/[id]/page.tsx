import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Printer } from 'lucide-react'

import { getQuoteById } from '@/lib/queries/quotes'
import { setQuoteStatus, deleteQuote } from '@/lib/actions/quote'
import {
  computeQuoteTotals,
  formatNok,
  quoteStatusValues,
  quoteStatusLabels,
} from '@/lib/quote'
import { QuoteForm } from '@/components/admin/quote-form'
import { QuoteSendForm } from '@/components/admin/quote-actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Rediger tilbud',
  robots: { index: false, follow: false },
}

const statusStyles: Record<string, string> = {
  utkast: 'bg-muted text-muted-foreground',
  sendt: 'bg-blue-500/15 text-blue-700',
  akseptert: 'bg-emerald-500/15 text-emerald-700',
  avslaatt: 'bg-rose-500/15 text-rose-700',
}

const selectClass =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export default async function RedigerTilbudPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const quote = await getQuoteById(id)
  if (!quote) notFound()

  const totals = computeQuoteTotals(quote.items, quote.vat_rate)

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="text-muted-foreground font-mono text-base">
              {quote.quote_number ?? '—'}
            </span>{' '}
            · {quote.title}
          </h1>
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase',
              statusStyles[quote.status] ?? 'bg-muted',
            )}
          >
            {quoteStatusLabels[quote.status]}
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          {quote.customer_name} · Totalt {formatNok(totals.total)} (inkl. {quote.vat_rate} % mva)
        </p>
      </header>

      <div className="border-border bg-background space-y-4 rounded-2xl border p-5">
        <QuoteSendForm
          quoteId={quote.id}
          hasEmail={Boolean(quote.customer_email)}
          alreadySent={quote.status === 'sendt' || quote.status === 'akseptert'}
        />

        <div className="border-border flex flex-wrap items-center gap-3 border-t pt-4">
          <form action={setQuoteStatus} className="flex items-center gap-2">
            <input type="hidden" name="id" value={quote.id} />
            <label className="text-muted-foreground text-xs">Status</label>
            <select name="status" defaultValue={quote.status} className={selectClass}>
              {quoteStatusValues.map((s) => (
                <option key={s} value={s}>
                  {quoteStatusLabels[s]}
                </option>
              ))}
            </select>
            <Button type="submit" variant="outline" size="sm">
              Oppdater
            </Button>
          </form>

          <Link
            href={`/admin/tilbud/${quote.id}/print`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5 ml-auto')}
          >
            <Printer className="size-3.5" />
            Forhåndsvis / skriv ut
          </Link>

          <form action={deleteQuote}>
            <input type="hidden" name="id" value={quote.id} />
            <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
              Slett tilbud
            </Button>
          </form>
        </div>
      </div>

      <QuoteForm
        initial={{
          id: quote.id,
          inquiry_id: quote.inquiry_id,
          customer_name: quote.customer_name,
          customer_email: quote.customer_email,
          customer_phone: quote.customer_phone,
          customer_address: quote.customer_address,
          title: quote.title,
          intro: quote.intro,
          notes: quote.notes,
          vat_rate: quote.vat_rate,
          valid_until: quote.valid_until,
          items: quote.items,
        }}
      />
    </div>
  )
}

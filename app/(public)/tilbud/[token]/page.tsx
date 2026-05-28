import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CheckCircle2 } from 'lucide-react'

import { getQuoteByToken } from '@/lib/queries/quotes'
import { computeQuoteTotals, formatNok } from '@/lib/quote'
import { SignQuoteForm } from '@/components/sign-quote-form'

export const metadata: Metadata = {
  title: 'Tilbud',
  robots: { index: false, follow: false },
}

const dateFmt = new Intl.DateTimeFormat('nb-NO', { dateStyle: 'long', timeZone: 'UTC' })
const dateTimeFmt = new Intl.DateTimeFormat('nb-NO', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Oslo',
})

export default function PublicQuotePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <QuoteContent params={params} />
    </Suspense>
  )
}

async function QuoteContent({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const quote = await getQuoteByToken(token)
  if (!quote) notFound()

  const totals = computeQuoteTotals(quote.items, quote.vat_rate)
  const isSigned = Boolean(quote.signed_at)
  const validUntil = quote.valid_until
    ? dateFmt.format(new Date(`${quote.valid_until}T00:00:00Z`))
    : null
  const created = dateFmt.format(new Date(quote.created_at))

  return (
    <main className="px-6 pt-32 pb-24 md:pt-40">
      <article className="border-border bg-background mx-auto max-w-3xl space-y-8 rounded-2xl border p-8 md:p-12">
        <header className="border-border space-y-2 border-b pb-6">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#2C3E2D]">
            Leganger Bygg AS — Bergen
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Tilbud{quote.quote_number ? ` ${quote.quote_number}` : ''}
          </h1>
          <p className="text-muted-foreground text-base">{quote.title}</p>
          <p className="text-muted-foreground text-xs">
            Dato: {created}
            {validUntil ? ` · Gyldig til ${validUntil}` : ''}
          </p>
        </header>

        <section className="text-sm">
          <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">Til</p>
          <p className="mt-1 font-medium">{quote.customer_name}</p>
          {quote.customer_address ? (
            <p className="text-xs">{quote.customer_address}</p>
          ) : null}
        </section>

        {quote.intro ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{quote.intro}</p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-sm">
            <thead>
              <tr className="text-muted-foreground border-foreground border-b-2 text-left text-[10px] tracking-[0.15em] uppercase">
                <th className="py-2 pr-3 font-medium">Beskrivelse</th>
                <th className="py-2 pr-3 text-right font-medium">Antall</th>
                <th className="py-2 pr-3 text-right font-medium">Enhetspris</th>
                <th className="py-2 text-right font-medium">Sum</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {quote.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 pr-3">{item.description}</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums whitespace-nowrap">
                    {item.quantity}
                    {item.unit ? ` ${item.unit}` : ''}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums whitespace-nowrap">
                    {formatNok(item.unit_price)}
                  </td>
                  <td className="py-2.5 text-right font-medium tabular-nums whitespace-nowrap">
                    {formatNok(item.quantity * item.unit_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="ml-auto w-full max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Sum eks. mva</dt>
            <dd className="tabular-nums">{formatNok(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Mva ({quote.vat_rate} %)</dt>
            <dd className="tabular-nums">{formatNok(totals.vat)}</dd>
          </div>
          <div className="border-foreground flex justify-between border-t-2 pt-2 text-base font-semibold">
            <dt>Totalt inkl. mva</dt>
            <dd className="tabular-nums">{formatNok(totals.total)}</dd>
          </div>
        </dl>

        {quote.notes ? (
          <section className="border-border border-t pt-6">
            <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
              Vilkår / notater
            </p>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{quote.notes}</p>
          </section>
        ) : null}

        {isSigned ? (
          <section className="border-emerald-500/30 bg-emerald-500/10 rounded-2xl border p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 text-emerald-700" />
              <div>
                <p className="font-semibold text-emerald-900">Tilbudet er godkjent.</p>
                <p className="text-emerald-900/80 mt-1 text-sm">
                  Signert av <strong>{quote.signed_name}</strong>{' '}
                  {quote.signed_at ? dateTimeFmt.format(new Date(quote.signed_at)) : ''}.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <SignQuoteForm token={token} customerName={quote.customer_name} />
        )}
      </article>
    </main>
  )
}

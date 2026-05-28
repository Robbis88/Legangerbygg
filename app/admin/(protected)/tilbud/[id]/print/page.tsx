import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getQuoteById } from '@/lib/queries/quotes'
import { computeQuoteTotals, formatNok } from '@/lib/quote'
import { PrintButton } from '@/components/admin/print-button'

export const metadata: Metadata = {
  title: 'Tilbud — utskrift',
  robots: { index: false, follow: false },
}

const dateFmt = new Intl.DateTimeFormat('nb-NO', { dateStyle: 'long', timeZone: 'UTC' })

export default async function PrintTilbudPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const quote = await getQuoteById(id)
  if (!quote) notFound()
  const totals = computeQuoteTotals(quote.items, quote.vat_rate)
  const validUntil = quote.valid_until
    ? dateFmt.format(new Date(`${quote.valid_until}T00:00:00Z`))
    : null
  const created = dateFmt.format(new Date(quote.created_at))

  return (
    <div className="bg-white text-black">
      <div className="mx-auto max-w-3xl px-10 py-10 print:max-w-none print:px-12 print:py-10">
        <div className="mb-8 flex items-end justify-between gap-4 print:hidden">
          <p className="text-muted-foreground text-xs">
            Forhåndsvisning — bruk knappen for å skrive ut eller lagre som PDF.
          </p>
          <PrintButton />
        </div>

        <header className="flex items-start justify-between gap-6 border-b border-black/80 pb-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#2C3E2D]">
              Leganger Bygg AS
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Tilbud{quote.quote_number ? ` ${quote.quote_number}` : ''}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">{quote.title}</p>
          </div>
          <div className="text-right text-xs leading-relaxed">
            <p>Dato: {created}</p>
            {validUntil ? <p>Gyldig til: {validUntil}</p> : null}
          </div>
        </header>

        <section className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">Til</p>
            <p className="font-medium">{quote.customer_name}</p>
            {quote.customer_address ? <p className="text-xs">{quote.customer_address}</p> : null}
            {quote.customer_email ? <p className="text-xs">{quote.customer_email}</p> : null}
            {quote.customer_phone ? <p className="text-xs">{quote.customer_phone}</p> : null}
          </div>
        </section>

        {quote.intro ? (
          <p className="mt-6 text-sm leading-relaxed whitespace-pre-wrap">{quote.intro}</p>
        ) : null}

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-black text-left">
              <th className="py-2 pr-3 text-[10px] tracking-[0.15em] uppercase">Beskrivelse</th>
              <th className="py-2 pr-3 text-right text-[10px] tracking-[0.15em] uppercase">Antall</th>
              <th className="py-2 pr-3 text-right text-[10px] tracking-[0.15em] uppercase">Enhetspris</th>
              <th className="py-2 text-right text-[10px] tracking-[0.15em] uppercase">Sum</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, idx) => (
              <tr key={idx} className="border-b border-black/10 align-top">
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

        <div className="mt-6 ml-auto w-full max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sum eks. mva</span>
            <span className="tabular-nums">{formatNok(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mva ({quote.vat_rate} %)</span>
            <span className="tabular-nums">{formatNok(totals.vat)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-black pt-2 text-base font-semibold">
            <span>Totalt inkl. mva</span>
            <span className="tabular-nums">{formatNok(totals.total)}</span>
          </div>
        </div>

        {quote.notes ? (
          <section className="mt-10">
            <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
              Vilkår / notater
            </p>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{quote.notes}</p>
          </section>
        ) : null}

        <footer className="mt-12 border-t border-black/20 pt-4 text-xs text-muted-foreground">
          Leganger Bygg AS — Bergen
        </footer>
      </div>
    </div>
  )
}

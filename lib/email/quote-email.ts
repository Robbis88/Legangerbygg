import { formatNok } from '@/lib/payroll'
import { computeQuoteTotals, type QuoteItemInput } from '@/lib/quote'

const dateFmt = new Intl.DateTimeFormat('nb-NO', { dateStyle: 'long', timeZone: 'UTC' })

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br/>')
}

export type QuoteEmailArgs = {
  quoteNumber: string | null
  title: string
  intro: string | null
  notes: string | null
  customerName: string
  vatRate: number
  validUntil: string | null
  items: (QuoteItemInput & { unit: string | null })[]
  signingUrl?: string | null
}

export function renderQuoteEmail(args: QuoteEmailArgs): { subject: string; html: string; text: string } {
  const totals = computeQuoteTotals(args.items, args.vatRate)
  const subject = `Tilbud ${args.quoteNumber ?? ''} — ${args.title}`.trim()

  const itemRows = args.items
    .map((i) => {
      const line = i.quantity * i.unit_price
      return `<tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e5e5;font-size:14px;">${escapeHtml(i.description)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e5e5;font-size:14px;text-align:right;white-space:nowrap;">${i.quantity}${i.unit ? ` ${escapeHtml(i.unit)}` : ''}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e5e5;font-size:14px;text-align:right;white-space:nowrap;">${formatNok(i.unit_price)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e5e5;font-size:14px;text-align:right;white-space:nowrap;font-weight:600;">${formatNok(line)}</td>
      </tr>`
    })
    .join('')

  const validUntilFmt = args.validUntil
    ? dateFmt.format(new Date(`${args.validUntil}T00:00:00Z`))
    : null

  const html = `<!doctype html>
<html lang="nb">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a0a0a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e5e5;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px 36px 8px;">
          <p style="margin:0;font-family:monospace;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#2C3E2D;">Leganger Bygg AS</p>
          <h1 style="margin:6px 0 0;font-size:24px;font-weight:600;letter-spacing:-0.01em;">Tilbud${args.quoteNumber ? ` ${escapeHtml(args.quoteNumber)}` : ''}</h1>
          <p style="margin:4px 0 0;font-size:14px;color:#525252;">${escapeHtml(args.title)}</p>
        </td></tr>

        <tr><td style="padding:24px 36px 8px;font-size:14px;line-height:1.55;">
          <p style="margin:0 0 6px;">Hei ${escapeHtml(args.customerName)},</p>
          ${args.intro ? `<p style="margin:0;">${nl2br(args.intro)}</p>` : '<p style="margin:0;">Her er tilbudet du etterspurte. Si fra om noe er uklart eller skal justeres.</p>'}
        </td></tr>

        ${
          args.signingUrl
            ? `<tr><td style="padding:18px 36px 4px;">
                 <a href="${escapeHtml(args.signingUrl)}" style="display:inline-block;background:#2C3E2D;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:10px;font-size:14px;font-weight:600;letter-spacing:0.02em;">Se og godkjenn tilbudet</a>
                 <p style="margin:8px 0 0;font-size:12px;color:#8b8b8b;">Du kan ogsaa svare paa denne e-posten om noe skal justeres.</p>
               </td></tr>`
            : ''
        }

        <tr><td style="padding:16px 36px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <thead>
              <tr>
                <th align="left" style="padding:8px 8px;border-bottom:2px solid #0a0a0a;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#525252;">Beskrivelse</th>
                <th align="right" style="padding:8px 8px;border-bottom:2px solid #0a0a0a;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#525252;">Antall</th>
                <th align="right" style="padding:8px 8px;border-bottom:2px solid #0a0a0a;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#525252;">Enhetspris</th>
                <th align="right" style="padding:8px 8px;border-bottom:2px solid #0a0a0a;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#525252;">Sum</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
        </td></tr>

        <tr><td style="padding:8px 36px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="font-size:14px;color:#525252;padding:6px 8px;text-align:right;">Sum eks. mva</td><td style="font-size:14px;padding:6px 8px;text-align:right;white-space:nowrap;width:140px;">${formatNok(totals.subtotal)}</td></tr>
            <tr><td style="font-size:14px;color:#525252;padding:6px 8px;text-align:right;">Mva (${args.vatRate} %)</td><td style="font-size:14px;padding:6px 8px;text-align:right;white-space:nowrap;">${formatNok(totals.vat)}</td></tr>
            <tr><td style="font-size:16px;font-weight:600;padding:10px 8px;text-align:right;border-top:2px solid #0a0a0a;">Totalt inkl. mva</td><td style="font-size:16px;font-weight:600;padding:10px 8px;text-align:right;white-space:nowrap;border-top:2px solid #0a0a0a;">${formatNok(totals.total)}</td></tr>
          </table>
        </td></tr>

        ${validUntilFmt ? `<tr><td style="padding:0 36px 8px;font-size:13px;color:#525252;">Tilbudet er gyldig til <strong>${validUntilFmt}</strong>.</td></tr>` : ''}
        ${args.notes ? `<tr><td style="padding:8px 36px 24px;font-size:13px;color:#525252;line-height:1.55;">${nl2br(args.notes)}</td></tr>` : ''}

        <tr><td style="padding:0 36px 28px;font-size:13px;color:#525252;border-top:1px solid #e5e5e5;padding-top:18px;">
          Vennlig hilsen<br/><strong style="color:#0a0a0a;">Leganger Bygg AS</strong>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text = [
    `Tilbud${args.quoteNumber ? ` ${args.quoteNumber}` : ''} - ${args.title}`,
    '',
    `Hei ${args.customerName},`,
    args.intro ? `\n${args.intro}\n` : '\nHer er tilbudet du etterspurte.\n',
    'Linjer:',
    ...args.items.map(
      (i) =>
        `- ${i.description} | ${i.quantity}${i.unit ? ' ' + i.unit : ''} x ${formatNok(i.unit_price)} = ${formatNok(i.quantity * i.unit_price)}`,
    ),
    '',
    `Sum eks. mva: ${formatNok(totals.subtotal)}`,
    `Mva (${args.vatRate} %): ${formatNok(totals.vat)}`,
    `Totalt: ${formatNok(totals.total)}`,
    validUntilFmt ? `\nGyldig til: ${validUntilFmt}` : '',
    args.notes ? `\n${args.notes}` : '',
    '\nVennlig hilsen\nLeganger Bygg AS',
  ].join('\n')

  return { subject, html, text }
}

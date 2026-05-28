import { formatNok } from '@/lib/payroll'

export type QuoteItemInput = {
  description: string
  quantity: number
  unit: string | null
  unit_price: number
}

export type QuoteTotals = {
  subtotal: number
  vat: number
  total: number
}

export function computeQuoteTotals(items: QuoteItemInput[], vatRate: number): QuoteTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity ?? 0) * (item.unit_price ?? 0),
    0,
  )
  const vat = subtotal * (vatRate / 100)
  return { subtotal, vat, total: subtotal + vat }
}

export const quoteStatusValues = ['utkast', 'sendt', 'akseptert', 'avslaatt'] as const

export const quoteStatusLabels: Record<(typeof quoteStatusValues)[number], string> = {
  utkast: 'Utkast',
  sendt: 'Sendt',
  akseptert: 'Akseptert',
  avslaatt: 'Avslått',
}

export { formatNok }

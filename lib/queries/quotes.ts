import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { computeQuoteTotals, type QuoteItemInput } from '@/lib/quote'
import type { Database } from '@/types/supabase'

export type QuoteRow = Database['public']['Tables']['quotes']['Row']
export type QuoteItemRow = Database['public']['Tables']['quote_items']['Row']

export type QuoteListItem = Pick<
  QuoteRow,
  'id' | 'quote_number' | 'customer_name' | 'title' | 'status' | 'sent_at' | 'created_at' | 'vat_rate'
> & { total: number; itemCount: number }

export async function getQuotes(): Promise<QuoteListItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('quotes')
    .select(
      'id, quote_number, customer_name, title, status, sent_at, created_at, vat_rate, quote_items(quantity, unit_price)',
    )
    .order('created_at', { ascending: false })

  return (data ?? []).map((q) => {
    const items = (q.quote_items ?? []).map((i) => ({
      description: '',
      quantity: Number(i.quantity),
      unit: null,
      unit_price: Number(i.unit_price),
    }))
    const { total } = computeQuoteTotals(items, Number(q.vat_rate))
    return {
      id: q.id,
      quote_number: q.quote_number,
      customer_name: q.customer_name,
      title: q.title,
      status: q.status,
      sent_at: q.sent_at,
      created_at: q.created_at,
      vat_rate: Number(q.vat_rate),
      total,
      itemCount: items.length,
    }
  })
}

export type QuoteDetail = QuoteRow & {
  items: QuoteItemInput[]
  itemRows: QuoteItemRow[]
}

export async function getQuoteById(id: string): Promise<QuoteDetail | null> {
  const supabase = await createClient()
  const { data: quote } = await supabase.from('quotes').select('*').eq('id', id).maybeSingle()
  if (!quote) return null

  const { data: items } = await supabase
    .from('quote_items')
    .select('*')
    .eq('quote_id', id)
    .order('sort_order', { ascending: true })

  const rows = items ?? []
  return {
    ...quote,
    vat_rate: Number(quote.vat_rate),
    itemRows: rows,
    items: rows.map((i) => ({
      description: i.description,
      quantity: Number(i.quantity),
      unit: i.unit,
      unit_price: Number(i.unit_price),
    })),
  }
}

/**
 * Henter et tilbud via offentlig token (bypasser RLS via service-role siden
 * kunden ikke er autentisert — token-en er aksesskontrollen).
 */
export async function getQuoteByToken(token: string): Promise<QuoteDetail | null> {
  if (!token) return null
  const admin = createAdminClient()
  const { data: quote } = await admin
    .from('quotes')
    .select('*')
    .eq('public_token', token)
    .maybeSingle()
  if (!quote) return null

  const { data: items } = await admin
    .from('quote_items')
    .select('*')
    .eq('quote_id', quote.id)
    .order('sort_order', { ascending: true })

  const rows = items ?? []
  return {
    ...quote,
    vat_rate: Number(quote.vat_rate),
    itemRows: rows,
    items: rows.map((i) => ({
      description: i.description,
      quantity: Number(i.quantity),
      unit: i.unit,
      unit_price: Number(i.unit_price),
    })),
  }
}

/** Genererer neste tilbudsnummer T-YYYY-NNN basert paa antall tilbud i aar. */
export async function generateQuoteNumber(): Promise<string> {
  const supabase = await createClient()
  const year = new Date().getFullYear()
  const yearStart = `${year}-01-01T00:00:00Z`
  const { count } = await supabase
    .from('quotes')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', yearStart)
  const next = (count ?? 0) + 1
  return `T-${year}-${String(next).padStart(3, '0')}`
}

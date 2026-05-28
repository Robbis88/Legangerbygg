'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'

import { requireStaff } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { quoteSchema } from '@/lib/validators/quote'
import { generateQuoteNumber } from '@/lib/queries/quotes'
import { renderQuoteEmail } from '@/lib/email/quote-email'
import { quoteStatusValues } from '@/lib/quote'
import type { Database } from '@/types/supabase'

type QuoteStatus = Database['public']['Enums']['quote_status']

export type QuoteActionResult = { ok: false; error: string } | null

export async function saveQuote(
  _prev: QuoteActionResult,
  formData: FormData,
): Promise<QuoteActionResult> {
  await requireStaff()

  let items: unknown
  try {
    items = JSON.parse((formData.get('items_json') as string) || '[]')
  } catch {
    return { ok: false, error: 'Linjeposter er ugyldige.' }
  }

  const parsed = quoteSchema.safeParse({
    id: formData.get('id'),
    inquiry_id: formData.get('inquiry_id'),
    customer_name: formData.get('customer_name'),
    customer_email: formData.get('customer_email'),
    customer_phone: formData.get('customer_phone'),
    customer_address: formData.get('customer_address'),
    title: formData.get('title'),
    intro: formData.get('intro'),
    notes: formData.get('notes'),
    vat_rate: formData.get('vat_rate'),
    valid_until: formData.get('valid_until'),
    items,
  })
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Skjemaet inneholder feil.' }
  }

  const d = parsed.data
  const supabase = await createClient()

  let quoteId: string

  if (d.id) {
    const { error } = await supabase
      .from('quotes')
      .update({
        inquiry_id: d.inquiry_id ?? null,
        customer_name: d.customer_name,
        customer_email: d.customer_email ?? null,
        customer_phone: d.customer_phone ?? null,
        customer_address: d.customer_address ?? null,
        title: d.title,
        intro: d.intro ?? null,
        notes: d.notes ?? null,
        vat_rate: d.vat_rate,
        valid_until: d.valid_until ?? null,
      })
      .eq('id', d.id)
    if (error) {
      console.error('[saveQuote.update]', error)
      return { ok: false, error: 'Kunne ikke oppdatere tilbudet.' }
    }
    quoteId = d.id
  } else {
    const quote_number = await generateQuoteNumber()
    const { data, error } = await supabase
      .from('quotes')
      .insert({
        quote_number,
        inquiry_id: d.inquiry_id ?? null,
        customer_name: d.customer_name,
        customer_email: d.customer_email ?? null,
        customer_phone: d.customer_phone ?? null,
        customer_address: d.customer_address ?? null,
        title: d.title,
        intro: d.intro ?? null,
        notes: d.notes ?? null,
        vat_rate: d.vat_rate,
        valid_until: d.valid_until ?? null,
      })
      .select('id')
      .single()
    if (error || !data) {
      console.error('[saveQuote.insert]', error)
      return { ok: false, error: 'Kunne ikke opprette tilbudet.' }
    }
    quoteId = data.id
  }

  // Erstatt linjeposter (slett alt + sett inn nytt — enklere enn diffing).
  await supabase.from('quote_items').delete().eq('quote_id', quoteId)
  const { error: itemsError } = await supabase.from('quote_items').insert(
    d.items.map((item, index) => ({
      quote_id: quoteId,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit ?? null,
      unit_price: item.unit_price,
      sort_order: index,
    })),
  )
  if (itemsError) {
    console.error('[saveQuote.items]', itemsError)
    return { ok: false, error: 'Kunne ikke lagre linjeposter.' }
  }

  revalidatePath('/admin/tilbud')
  revalidatePath(`/admin/tilbud/${quoteId}`)
  redirect(`/admin/tilbud/${quoteId}`)
}

export async function deleteQuote(formData: FormData): Promise<void> {
  await requireStaff()
  const id = formData.get('id')
  if (typeof id !== 'string') return

  const supabase = await createClient()
  const { error } = await supabase.from('quotes').delete().eq('id', id)
  if (error) {
    console.error('[deleteQuote]', error)
    return
  }
  revalidatePath('/admin/tilbud')
  redirect('/admin/tilbud')
}

export async function setQuoteStatus(formData: FormData): Promise<void> {
  await requireStaff()
  const id = formData.get('id')
  const status = formData.get('status')
  if (typeof id !== 'string' || typeof status !== 'string') return
  if (!(quoteStatusValues as readonly string[]).includes(status)) return

  const supabase = await createClient()
  const { error } = await supabase
    .from('quotes')
    .update({ status: status as QuoteStatus })
    .eq('id', id)
  if (error) console.error('[setQuoteStatus]', error)
  revalidatePath(`/admin/tilbud/${id}`)
  revalidatePath('/admin/tilbud')
}

export type SendResult = { ok: true; message: string } | { ok: false; error: string }

export async function sendQuote(_prev: SendResult | null, formData: FormData): Promise<SendResult> {
  await requireStaff()
  const id = formData.get('id')
  if (typeof id !== 'string') return { ok: false, error: 'Mangler tilbuds-id.' }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) {
    return {
      ok: false,
      error: 'Resend er ikke konfigurert. Sett RESEND_FROM_EMAIL (verifisert avsender) og last på nytt.',
    }
  }

  const supabase = await createClient()
  const { data: quote } = await supabase.from('quotes').select('*').eq('id', id).maybeSingle()
  if (!quote) return { ok: false, error: 'Fant ikke tilbudet.' }
  if (!quote.customer_email) {
    return { ok: false, error: 'Kunden mangler e-postadresse — fyll inn i skjemaet.' }
  }
  const { data: itemRows } = await supabase
    .from('quote_items')
    .select('*')
    .eq('quote_id', id)
    .order('sort_order', { ascending: true })

  const items = (itemRows ?? []).map((i) => ({
    description: i.description,
    quantity: Number(i.quantity),
    unit: i.unit,
    unit_price: Number(i.unit_price),
  }))

  const { subject, html, text } = renderQuoteEmail({
    quoteNumber: quote.quote_number,
    title: quote.title,
    intro: quote.intro,
    notes: quote.notes,
    customerName: quote.customer_name,
    vatRate: Number(quote.vat_rate),
    validUntil: quote.valid_until,
    items,
  })

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: quote.customer_email,
      replyTo: from,
      subject,
      html,
      text,
    })
    if (error) {
      console.error('[sendQuote.resend]', error)
      return { ok: false, error: `Resend-feil: ${error.message ?? 'ukjent feil'}` }
    }
  } catch (err) {
    console.error('[sendQuote.catch]', err)
    return { ok: false, error: 'Sending feilet. Sjekk konfigurasjonen.' }
  }

  const { error: upError } = await supabase
    .from('quotes')
    .update({ status: 'sendt', sent_at: new Date().toISOString() })
    .eq('id', id)
  if (upError) console.error('[sendQuote.statusUpdate]', upError)

  revalidatePath(`/admin/tilbud/${id}`)
  revalidatePath('/admin/tilbud')
  return { ok: true, message: `Tilbudet er sendt til ${quote.customer_email}.` }
}

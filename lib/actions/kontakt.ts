'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { inquirySchema } from '@/lib/validators/inquiry'
import { renderInquiryNotification } from '@/lib/email/inquiry-notification'
import { sendMail, inquiryRecipient } from '@/lib/email/transport'

export type SubmitInquiryResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

/**
 * Tar imot innsendt kontaktskjema, lagrer i `inquiries`, og sender
 * Resend-varsel til RESEND_TO_INQUIRY. E-postfeil stopper ikke
 * lagringen — vi vil aldri tape en henvendelse fordi Resend er nede.
 */
export async function submitInquiry(
  _prev: SubmitInquiryResult | null,
  formData: FormData,
): Promise<SubmitInquiryResult> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    project_type: formData.get('project_type'),
    budget: formData.get('budget'),
    description: formData.get('description'),
    hp: formData.get('hp'),
  }

  const parsed = inquirySchema.safeParse(raw)

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]
      if (typeof field === 'string' && !fieldErrors[field]) {
        fieldErrors[field] = issue.message
      }
    }
    return {
      ok: false,
      error: 'Skjemaet inneholder feil. Sjekk markerte felter.',
      fieldErrors,
    }
  }

  // Honeypot — botter får samme respons som suksess uten å skrive til DB
  if (parsed.data.hp) {
    return { ok: true, id: 'honeypot' }
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      address: parsed.data.address ?? null,
      project_type: parsed.data.project_type ?? null,
      budget: parsed.data.budget ?? null,
      description: parsed.data.description,
    })
    .select('id, created_at')
    .single()

  if (error || !data) {
    console.error('[submitInquiry] insert failed', error)
    return {
      ok: false,
      error: 'Vi klarte ikke å lagre meldingen din. Prøv igjen om litt eller ring oss.',
    }
  }

  // E-postvarsel — best effort. Skal aldri kaste videre.
  await sendInquiryNotification({
    inquiry: parsed.data,
    inquiryId: data.id,
    receivedAt: data.created_at,
  }).catch((err: unknown) => {
    console.error('[submitInquiry] email failed (lagret OK)', err)
  })

  return { ok: true, id: data.id }
}

async function sendInquiryNotification(args: {
  inquiry: ReturnType<typeof inquirySchema.parse>
  inquiryId: string
  receivedAt: string
}) {
  const to = inquiryRecipient()
  if (!to) {
    console.warn('[submitInquiry] SMTP ikke konfigurert — henvendelse lagret, men varsel ikke sendt')
    return
  }

  const { subject, html, text } = renderInquiryNotification({
    inquiry: args.inquiry,
    inquiryId: args.inquiryId,
    receivedAt: new Intl.DateTimeFormat('nb-NO', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Europe/Oslo',
    }).format(new Date(args.receivedAt)),
  })

  await sendMail({ to, replyTo: args.inquiry.email, subject, html, text })
}

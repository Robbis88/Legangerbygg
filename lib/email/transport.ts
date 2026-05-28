import 'server-only'
import nodemailer from 'nodemailer'

/**
 * Sender e-post via Domeneshops SMTP — bruker den faktiske post@legangerbygg.no-
 * postboksen som avsender, slik at SPF/DKIM (allerede konfigurert i Domeneshop)
 * fungerer uten ekstra oppsett. Returnerer `null` hvis SMTP ikke er konfigurert,
 * slik at handlinger kan svare med en pen feilmelding.
 *
 * Env-variabler (settes paa Vercel):
 *   SMTP_HOST=smtp.domeneshop.no
 *   SMTP_PORT=587
 *   SMTP_USER=post@legangerbygg.no
 *   SMTP_PASSWORD=<passordet til postkassen>
 *   MAIL_FROM=Leganger Bygg AS <post@legangerbygg.no>
 *   MAIL_TO_INQUIRY=post@legangerbygg.no
 */
export type SendMailArgs = {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

export type SendMailResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured'; error?: undefined }
  | { ok: false; reason: 'failed'; error: string }

function readConfig() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD
  const from = mailFrom()
  if (!host || !port || !user || !pass || !from) return null
  return { host, port: Number(port), user, pass, from }
}

/** Avsender-streng — full "Navn <e-post>"-format hvis MAIL_FROM er satt. */
export function mailFrom(): string | null {
  return process.env.MAIL_FROM || process.env.SMTP_USER || null
}

export function inquiryRecipient(): string | null {
  return process.env.MAIL_TO_INQUIRY || mailFrom()
}

/** True hvis SMTP er klar til bruk. */
export function isMailConfigured(): boolean {
  return readConfig() !== null
}

export async function sendMail(args: SendMailArgs): Promise<SendMailResult> {
  const cfg = readConfig()
  if (!cfg) return { ok: false, reason: 'not-configured' }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
  })

  try {
    await transporter.sendMail({
      from: cfg.from,
      to: args.to,
      replyTo: args.replyTo,
      subject: args.subject,
      html: args.html,
      text: args.text,
    })
    return { ok: true }
  } catch (err) {
    console.error('[sendMail]', err)
    const message = err instanceof Error ? err.message : 'Ukjent feil'
    return { ok: false, reason: 'failed', error: message }
  }
}

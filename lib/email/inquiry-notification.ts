import 'server-only'
import type { InquiryInput } from '@/lib/validators/inquiry'
import { projectTypeLabels } from '@/lib/validators/inquiry'

type InquiryNotificationArgs = {
  inquiry: InquiryInput
  inquiryId: string
  receivedAt: string
}

/**
 * Bygger HTML- og tekstversjon av varsel-e-posten som sendes til Robert
 * når noen sender inn kontaktskjemaet. Vi har bevisst en ren HTML-mal
 * uten React Email-pakker — kontaktskjema-varsler trenger ikke
 * komponent-rendering.
 */
export function renderInquiryNotification({
  inquiry,
  inquiryId,
  receivedAt,
}: InquiryNotificationArgs) {
  const projectType = inquiry.project_type
    ? projectTypeLabels[inquiry.project_type as keyof typeof projectTypeLabels]
    : undefined

  const subject = `Ny henvendelse fra ${inquiry.name}`

  const rows: Array<[string, string | undefined]> = [
    ['Navn', inquiry.name],
    ['E-post', inquiry.email],
    ['Telefon', inquiry.phone || undefined],
    ['Adresse', inquiry.address || undefined],
    ['Type prosjekt', projectType],
    ['Budsjett', inquiry.budget || undefined],
  ]

  const html = `<!doctype html>
<html lang="nb">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a0a0a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e5e5;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 16px;">
                <p style="margin:0 0 8px;font-size:11px;font-family:monospace;letter-spacing:0.25em;text-transform:uppercase;color:#8b8b8b;">Troas Bygg — ny henvendelse</p>
                <h1 style="margin:0;font-size:24px;font-weight:600;letter-spacing:-0.01em;">${escapeHtml(inquiry.name)}</h1>
                <p style="margin:8px 0 0;font-size:13px;color:#8b8b8b;">Mottatt ${escapeHtml(receivedAt)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${rows
                    .filter(([, value]) => value)
                    .map(
                      ([label, value]) => `
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#8b8b8b;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
                    <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#0a0a0a;">${escapeHtml(value!)}</td>
                  </tr>`,
                    )
                    .join('')}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px;">
                <p style="margin:0 0 8px;font-size:11px;font-family:monospace;letter-spacing:0.25em;text-transform:uppercase;color:#8b8b8b;">Beskrivelse</p>
                <p style="margin:0;font-size:15px;line-height:1.6;color:#0a0a0a;white-space:pre-wrap;">${escapeHtml(inquiry.description)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <p style="margin:0;font-size:11px;font-family:monospace;letter-spacing:0.25em;text-transform:uppercase;color:#c0c0c0;">ID ${escapeHtml(inquiryId)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = [
    `Ny henvendelse fra ${inquiry.name}`,
    `Mottatt ${receivedAt}`,
    '',
    ...rows.filter(([, v]) => v).map(([label, value]) => `${label}: ${value}`),
    '',
    'Beskrivelse:',
    inquiry.description,
    '',
    `ID: ${inquiryId}`,
  ].join('\n')

  return { subject, html, text }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

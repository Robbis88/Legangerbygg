function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const dateFmt = new Intl.DateTimeFormat('nb-NO', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Oslo',
})

export type SigningNotificationArgs = {
  quoteNumber: string | null
  title: string
  signedName: string
  signedAt: string
  adminUrl: string
}

export function renderSigningNotification(
  args: SigningNotificationArgs,
): { subject: string; html: string; text: string } {
  const number = args.quoteNumber ?? ''
  const subject = `Tilbud ${number} godkjent av ${args.signedName}`.replace(/\s+/g, ' ').trim()
  const when = dateFmt.format(new Date(args.signedAt))

  const html = `<!doctype html>
<html lang="nb"><body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a0a0a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e5e5;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px 12px;">
          <p style="margin:0;font-family:monospace;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#2C3E2D;">Leganger Bygg AS — Tilbud godkjent</p>
          <h1 style="margin:6px 0 0;font-size:22px;font-weight:600;letter-spacing:-0.01em;">Tilbud ${escapeHtml(number)}</h1>
          <p style="margin:4px 0 0;font-size:14px;color:#525252;">${escapeHtml(args.title)}</p>
        </td></tr>
        <tr><td style="padding:0 32px 8px;font-size:14px;line-height:1.55;">
          <p style="margin:0;"><strong>${escapeHtml(args.signedName)}</strong> godkjente tilbudet ${escapeHtml(when)}.</p>
        </td></tr>
        <tr><td style="padding:14px 32px 28px;">
          <a href="${escapeHtml(args.adminUrl)}" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:13px;font-weight:600;">Aapne i driftssystemet</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  const text = `Tilbud ${number} godkjent.\n\n${args.signedName} godkjente tilbudet ${when}.\n\nApne: ${args.adminUrl}`

  return { subject, html, text }
}

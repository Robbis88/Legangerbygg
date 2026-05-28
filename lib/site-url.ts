/**
 * Absolutt base-URL for siden. Brukes i e-poster og delbare lenker der vi
 * trenger en fullt kvalifisert URL (ikke en relativ).
 *
 * Sett NEXT_PUBLIC_SITE_URL paa Vercel naar dere knytter et ekte domene.
 */
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://legangerbygg.vercel.app'
}

export function quoteSigningUrl(token: string): string {
  return `${siteUrl()}/tilbud/${token}`
}

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { jsonLdScriptProps, organizationJsonLd } from '@/lib/structured-data'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://legangerbygg.no'),
  title: {
    default: 'Leganger Bygg AS',
    template: '%s — Leganger Bygg AS',
  },
  description:
    'Leganger Bygg AS pusser opp og renoverer leiligheter, rekkehus og eneboliger sentralt i Bergen. Full kontroll fra A til Å. Kvalitet i hvert prosjekt.',
  applicationName: 'Leganger Bygg AS',
  authors: [{ name: 'Leganger Bygg AS' }],
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    url: 'https://legangerbygg.no',
    siteName: 'Leganger Bygg AS',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nb" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen">
        {children}
        <script {...jsonLdScriptProps(organizationJsonLd())} />
      </body>
    </html>
  )
}

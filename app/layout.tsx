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
  metadataBase: new URL('https://troasbygg.no'),
  title: {
    default: 'Troas Bygg — Tømrer Ronny Osvaag AS',
    template: '%s — Troas Bygg',
  },
  description:
    'Tømrer Ronny Osvaag AS leverer nybygg, totalrenovering og prosjektledelse med kompromissløs kvalitet. Kvalitet i hvert prosjekt.',
  applicationName: 'Troas Bygg',
  authors: [{ name: 'Tømrer Ronny Osvaag AS' }],
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    url: 'https://troasbygg.no',
    siteName: 'Troas Bygg',
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

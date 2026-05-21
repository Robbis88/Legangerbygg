import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/mobil', '/mobil/'],
      },
    ],
    sitemap: 'https://troasbygg.no/sitemap.xml',
    host: 'https://troasbygg.no',
  }
}

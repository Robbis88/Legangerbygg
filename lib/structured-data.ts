/**
 * Schema.org JSON-LD-byggere for Leganger Bygg AS. Sendes inn i sider via
 * <script type="application/ld+json"> for å forbedre søkemotor-presentasjon
 * og rich-snippets (rating, lokasjon, lenker).
 */

export const SITE_URL = 'https://troasbygg.no'
const LEGAL_NAME = 'Leganger Bygg AS'
const BRAND_NAME = 'Leganger Bygg AS'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: LEGAL_NAME,
    alternateName: BRAND_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    slogan: 'Kvalitet i hvert prosjekt',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bergen',
      addressCountry: 'NO',
    },
  }
}

type LocalBusinessArgs = {
  reviewCount?: number
  ratingAverage?: number
}

export function generalContractorJsonLd({ reviewCount = 0, ratingAverage = 0 }: LocalBusinessArgs = {}) {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${SITE_URL}/#business`,
    name: LEGAL_NAME,
    alternateName: BRAND_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/icon.svg`,
    description:
      'Leganger Bygg AS leverer nybygg, totalrenovering, rehabilitering og prosjektledelse i Bergen — med fokus på kvalitet, presisjon og varig håndverk.',
    areaServed: { '@type': 'City', name: 'Bergen' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bergen',
      addressCountry: 'NO',
    },
    knowsAbout: [
      'Nybygg',
      'Totalrenovering',
      'Rehabilitering',
      'Prosjektledelse',
      'Flipp',
      'Moské-rehabilitering',
      'Rekkehus',
      'Våtromsfag',
    ],
  }

  if (reviewCount > 0 && ratingAverage > 0) {
    base.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: ratingAverage.toFixed(1),
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return base
}

type ProjectArgs = {
  title: string
  description: string | null
  slug: string
  coverImageUrl: string | null
  publishedAt: string | null
  address: string | null
}

export function projectJsonLd({
  title,
  description,
  slug,
  coverImageUrl,
  publishedAt,
  address,
}: ProjectArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: description ?? undefined,
    url: `${SITE_URL}/prosjekter/${slug}`,
    image: coverImageUrl ?? undefined,
    datePublished: publishedAt ?? undefined,
    locationCreated: address
      ? {
          '@type': 'Place',
          name: address,
        }
      : undefined,
    creator: { '@id': `${SITE_URL}/#organization` },
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Hjelper for å rendre <script type="application/ld+json">-tagger trygt i React.
 * JSON.stringify uten ekstra escaping siden vi kontrollerer innholdet.
 */
export function jsonLdScriptProps(data: unknown) {
  return {
    type: 'application/ld+json' as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  }
}

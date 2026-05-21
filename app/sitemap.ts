import type { MetadataRoute } from 'next'
import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'

import { createPublicClient } from '@/lib/supabase/public'
import { services } from '@/lib/services'

const SITE_URL = 'https://troasbygg.no'
// Statisk sist-oppdatert-dato per build. Endre når statiske sider får større oppdateringer.
const STATIC_LAST_MOD = '2026-05-21'

async function getProjectSitemapEntries() {
  'use cache'
  cacheLife('hours')
  cacheTag('projects')

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('projects')
    .select('slug, published_at, updated_at')
    .eq('is_public', true)
    .not('published_at', 'is', null)

  return (data ?? []).map((p) => ({
    slug: p.slug,
    lastModified: p.updated_at ?? p.published_at ?? STATIC_LAST_MOD,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjectSitemapEntries()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: STATIC_LAST_MOD, priority: 1, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/tjenester`, lastModified: STATIC_LAST_MOD, priority: 0.8 },
    { url: `${SITE_URL}/prosjekter`, lastModified: STATIC_LAST_MOD, priority: 0.8 },
    { url: `${SITE_URL}/anmeldelser`, lastModified: STATIC_LAST_MOD, priority: 0.6 },
    { url: `${SITE_URL}/om-oss`, lastModified: STATIC_LAST_MOD, priority: 0.6 },
    { url: `${SITE_URL}/kontakt`, lastModified: STATIC_LAST_MOD, priority: 0.7 },
  ]

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/tjenester/${s.slug}`,
    lastModified: STATIC_LAST_MOD,
    priority: 0.7,
  }))

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/prosjekter/${p.slug}`,
    lastModified: p.lastModified,
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...projectPages]
}

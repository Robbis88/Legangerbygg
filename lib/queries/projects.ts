import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'

import { createPublicClient } from '@/lib/supabase/public'
import type { Database } from '@/types/supabase'

export type ProjectListItem = Pick<
  Database['public']['Tables']['projects']['Row'],
  | 'id'
  | 'slug'
  | 'title'
  | 'type'
  | 'status'
  | 'address'
  | 'cover_image_url'
  | 'published_at'
>

export type ProjectFilter = {
  type?: Database['public']['Enums']['project_type']
  status?: Database['public']['Enums']['project_status']
  beforeAfter?: boolean
}

/**
 * Henter publiserte prosjekter for offentlig listing. Caches per filter-kombo.
 */
export async function getPublishedProjects(filter: ProjectFilter = {}): Promise<ProjectListItem[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('projects')

  const supabase = createPublicClient()
  let query = supabase
    .from('projects')
    .select('id, slug, title, type, status, address, cover_image_url, published_at')
    .eq('is_public', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  if (filter.type) {
    query = query.eq('type', filter.type)
  }
  if (filter.status) {
    query = query.eq('status', filter.status)
  }

  const { data, error } = await query
  if (error) {
    console.error('[getPublishedProjects]', error)
    return []
  }

  if (filter.beforeAfter) {
    // Filtrer videre i kode siden vi må vite om prosjektet har bilder
    // markert is_before OG is_after.
    const ids = (data ?? []).map((p) => p.id)
    if (ids.length === 0) return []

    const { data: imagePairs } = await supabase
      .from('project_images')
      .select('project_id, is_before, is_after')
      .in('project_id', ids)

    const hasBeforeAndAfter = new Set<string>()
    const projectsByBefore = new Set<string>()
    const projectsByAfter = new Set<string>()
    for (const img of imagePairs ?? []) {
      if (img.is_before) projectsByBefore.add(img.project_id)
      if (img.is_after) projectsByAfter.add(img.project_id)
    }
    for (const id of projectsByBefore) {
      if (projectsByAfter.has(id)) hasBeforeAndAfter.add(id)
    }

    return (data ?? []).filter((p) => hasBeforeAndAfter.has(p.id))
  }

  return data ?? []
}

export type ProjectDetail = Database['public']['Tables']['projects']['Row'] & {
  images: Database['public']['Tables']['project_images']['Row'][]
}

/**
 * Henter ett prosjekt + bilder, hvis publisert. Returnerer null hvis ikke funnet.
 */
export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('projects', `project:${slug}`)

  const supabase = createPublicClient()
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .not('published_at', 'is', null)
    .maybeSingle()

  if (error || !project) return null

  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', project.id)
    .order('sort_order', { ascending: true })

  return { ...project, images: images ?? [] }
}

/**
 * Slug-liste til generateStaticParams. Cacheable, men ikke kritisk å holde fersk.
 */
export async function getAllPublishedSlugs(): Promise<string[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('projects')

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('projects')
    .select('slug')
    .eq('is_public', true)
    .not('published_at', 'is', null)

  return (data ?? []).map((p) => p.slug)
}

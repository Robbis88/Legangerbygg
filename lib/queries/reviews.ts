import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'

import { createPublicClient } from '@/lib/supabase/public'
import type { Database } from '@/types/supabase'

export type ReviewListItem = Pick<
  Database['public']['Tables']['reviews']['Row'],
  'id' | 'customer_name' | 'customer_image_url' | 'rating' | 'body' | 'project_id' | 'created_at'
> & {
  project: { slug: string; title: string } | null
}

/**
 * Henter publiserte anmeldelser, valgfritt begrenset til siste N.
 */
export async function getPublishedReviews(limit?: number): Promise<ReviewListItem[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('reviews')

  const supabase = createPublicClient()
  let query = supabase
    .from('reviews')
    .select(
      'id, customer_name, customer_image_url, rating, body, project_id, created_at, projects(slug, title)',
    )
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) {
    console.error('[getPublishedReviews]', error)
    return []
  }

  return (data ?? []).map((r) => ({
    id: r.id,
    customer_name: r.customer_name,
    customer_image_url: r.customer_image_url,
    rating: r.rating,
    body: r.body,
    project_id: r.project_id,
    created_at: r.created_at,
    // Supabase joiner returnerer array når foreign key kunne være mange — her er det 1:1
    project: Array.isArray(r.projects) ? (r.projects[0] ?? null) : (r.projects ?? null),
  }))
}

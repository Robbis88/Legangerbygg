import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

export type HmsArticle = Database['public']['Tables']['hms_articles']['Row']

export async function getHmsArticles(): Promise<HmsArticle[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('hms_articles')
    .select('*')
    .order('category', { ascending: true, nullsFirst: false })
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true })
  return data ?? []
}

export async function getHmsArticleById(id: string): Promise<HmsArticle | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('hms_articles').select('*').eq('id', id).maybeSingle()
  return data
}

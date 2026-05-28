import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'

import { createAdminClient } from '@/lib/supabase/admin'

const TEAM_BUCKET = 'team'

export type TeamMember = {
  id: string
  full_name: string | null
  title: string | null
  bio: string | null
  avatar_url: string | null
}

/**
 * Henter team-medlemmer som skal vises p� om-oss-siden. Bruker service-role
 * (siden vi vil ha publikum-vennlige felter uten � �pne RLS for hourly_cost
 * o.l.), og caches noen timer med tag 'team'.
 */
export async function getTeamForAbout(): Promise<TeamMember[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('team')

  const admin = createAdminClient()
  const { data } = await admin
    .from('profiles')
    .select('id, full_name, title, bio, avatar_path')
    .eq('show_on_about', true)
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .order('full_name', { ascending: true })

  return (data ?? []).map((p) => ({
    id: p.id,
    full_name: p.full_name,
    title: p.title,
    bio: p.bio,
    avatar_url: p.avatar_path
      ? admin.storage.from(TEAM_BUCKET).getPublicUrl(p.avatar_path).data.publicUrl
      : null,
  }))
}

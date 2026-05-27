import 'server-only'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type UserRole = Database['public']['Enums']['user_role']

export type SessionContext = {
  userId: string
  email: string | null
  profile: Profile
}

/** Roller som kan skrive (eier + ansatt). Speiler `is_staff()` i databasen. */
export function isStaff(profile: Pick<Profile, 'role'>): boolean {
  return profile.role === 'eier' || profile.role === 'ansatt'
}

/**
 * Henter innlogget bruker + profil. Returnerer null hvis ikke innlogget.
 * Leser cookies → må kalles inne i en dynamisk (Suspense-wrappet) kontekst
 * når Cache Components er på.
 */
export async function getSession(): Promise<SessionContext | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return null
  return { userId: user.id, email: user.email ?? null, profile }
}

/**
 * Krever en aktiv intern bruker med tildelt rolle. Redirecter til login ellers.
 * Brukes som vakt i admin-layouten.
 */
export async function requireAdminAccess(): Promise<SessionContext> {
  const session = await getSession()
  if (!session || !session.profile.active || session.profile.role == null) {
    redirect('/admin/login')
  }
  return session
}

/** Krever skrivetilgang (eier/ansatt). */
export async function requireStaff(): Promise<SessionContext> {
  const session = await requireAdminAccess()
  if (!isStaff(session.profile)) {
    redirect('/admin')
  }
  return session
}

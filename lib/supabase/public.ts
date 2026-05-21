import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/**
 * Sesjonsløs klient for caching av offentlige spørringer. Brukes inni
 * `'use cache'`-funksjoner — vi får ikke kalle cookies()/headers() der.
 * RLS gjelder fortsatt (anon-rolle), så bare publisert innhold returneres.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
}

import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/**
 * Service-role klient som omgår RLS. Bruk KUN i Server Actions / Route Handlers
 * for operasjoner som krever forhøyede rettigheter (f.eks. opprette tilbud,
 * sende e-post som system, slette en bruker som admin).
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}

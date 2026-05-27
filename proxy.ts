import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

/**
 * Next 16 «Proxy» (tidligere Middleware). Kjører kun på /admin slik at den
 * offentlige siden beholder full caching/PPR uten en auth-sjekk per request.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: ['/admin/:path*'],
}

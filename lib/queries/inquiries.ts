import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

export type InquiryRow = Database['public']['Tables']['inquiries']['Row']

export async function getInquiries(filter?: 'ny' | 'behandlet'): Promise<InquiryRow[]> {
  const supabase = await createClient()
  let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false })
  if (filter) query = query.eq('status', filter)
  const { data } = await query
  return data ?? []
}

export async function getInquiryById(id: string): Promise<InquiryRow | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('inquiries').select('*').eq('id', id).maybeSingle()
  return data
}

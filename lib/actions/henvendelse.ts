'use server'

import { revalidatePath } from 'next/cache'

import { requireStaff } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type InquiryStatus = Database['public']['Enums']['inquiry_status']

export async function setInquiryStatus(formData: FormData): Promise<void> {
  await requireStaff()
  const id = formData.get('id')
  const status = formData.get('status')
  if (typeof id !== 'string' || (status !== 'ny' && status !== 'behandlet')) return

  const supabase = await createClient()
  const { error } = await supabase
    .from('inquiries')
    .update({ status: status as InquiryStatus })
    .eq('id', id)
  if (error) console.error('[setInquiryStatus]', error)
  revalidatePath('/admin/henvendelser')
  revalidatePath('/admin')
}

export async function deleteInquiry(formData: FormData): Promise<void> {
  await requireStaff()
  const id = formData.get('id')
  if (typeof id !== 'string') return

  const supabase = await createClient()
  const { error } = await supabase.from('inquiries').delete().eq('id', id)
  if (error) console.error('[deleteInquiry]', error)
  revalidatePath('/admin/henvendelser')
  revalidatePath('/admin')
}

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { requireStaff } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { hmsArticleSchema } from '@/lib/validators/hms'
import { slugify } from '@/lib/validators/project'

export type HmsResult = { ok: false; error: string } | null

export async function saveHmsArticle(
  _prev: HmsResult,
  formData: FormData,
): Promise<HmsResult> {
  await requireStaff()

  const parsed = hmsArticleSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    slug: formData.get('slug'),
    category: formData.get('category'),
    body: formData.get('body') ?? '',
    sort_order: formData.get('sort_order') ?? 0,
    published: formData.get('published'),
  })
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Skjemaet inneholder feil.' }
  }

  const d = parsed.data
  const slug = d.slug ?? (slugify(d.title) || null)
  const row = {
    title: d.title,
    slug,
    category: d.category ?? null,
    body: d.body,
    sort_order: d.sort_order,
    published: d.published,
  }

  const supabase = await createClient()
  const { error } = d.id
    ? await supabase.from('hms_articles').update(row).eq('id', d.id)
    : await supabase.from('hms_articles').insert(row)

  if (error) {
    if (error.code === '23505') {
      return { ok: false, error: `Slug «${slug}» er allerede i bruk — velg en annen.` }
    }
    console.error('[saveHmsArticle]', error)
    return { ok: false, error: 'Kunne ikke lagre artikkelen.' }
  }

  revalidatePath('/admin/hms')
  redirect('/admin/hms')
}

export async function deleteHmsArticle(formData: FormData): Promise<void> {
  await requireStaff()
  const id = formData.get('id')
  if (typeof id !== 'string') return

  const supabase = await createClient()
  const { error } = await supabase.from('hms_articles').delete().eq('id', id)
  if (error) console.error('[deleteHmsArticle]', error)
  revalidatePath('/admin/hms')
  redirect('/admin/hms')
}

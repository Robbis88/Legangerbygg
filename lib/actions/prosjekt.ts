'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { requireStaff } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { projectSchema, slugify } from '@/lib/validators/project'

export type ProjectActionResult = { ok: false; error: string } | null

export async function saveProject(
  _prev: ProjectActionResult,
  formData: FormData,
): Promise<ProjectActionResult> {
  await requireStaff()

  const parsed = projectSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    slug: formData.get('slug'),
    type: formData.get('type'),
    status: formData.get('status'),
    address: formData.get('address'),
    description: formData.get('description'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    estimated_hours: formData.get('estimated_hours'),
    cover_image_url: formData.get('cover_image_url'),
    is_public: formData.get('is_public'),
  })

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Skjemaet inneholder feil.' }
  }

  const d = parsed.data
  const slug = d.slug ?? slugify(d.title)
  if (!slug) return { ok: false, error: 'Klarte ikke lage en slug fra tittelen.' }

  const base = {
    title: d.title,
    slug,
    type: d.type,
    status: d.status,
    address: d.address ?? null,
    description: d.description ?? null,
    start_date: d.start_date ?? null,
    end_date: d.end_date ?? null,
    estimated_hours: d.estimated_hours ?? null,
    cover_image_url: d.cover_image_url ?? null,
    is_public: d.is_public,
  }

  const supabase = await createClient()
  let error

  if (d.id) {
    const { data: existing } = await supabase
      .from('projects')
      .select('published_at')
      .eq('id', d.id)
      .single()
    const published_at = d.is_public
      ? (existing?.published_at ?? new Date().toISOString())
      : (existing?.published_at ?? null)
    ;({ error } = await supabase
      .from('projects')
      .update({ ...base, published_at })
      .eq('id', d.id))
  } else {
    const published_at = d.is_public ? new Date().toISOString() : null
    ;({ error } = await supabase.from('projects').insert({ ...base, published_at }))
  }

  if (error) {
    console.error('[saveProject]', error)
    if (error.code === '23505') {
      return { ok: false, error: `Slug «${slug}» er allerede i bruk — velg en annen.` }
    }
    return { ok: false, error: 'Kunne ikke lagre prosjektet.' }
  }

  // Offentlig nettside cacher prosjekter med cacheTag('projects').
  revalidateTag('projects', 'max')
  revalidatePath('/admin/prosjekter')
  redirect('/admin/prosjekter')
}

export async function deleteProject(formData: FormData): Promise<void> {
  await requireStaff()
  const id = formData.get('id')
  if (typeof id !== 'string') return

  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) {
    console.error('[deleteProject]', error)
    return
  }

  revalidateTag('projects', 'max')
  revalidatePath('/admin/prosjekter')
  redirect('/admin/prosjekter')
}

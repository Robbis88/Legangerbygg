'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

import { requireStaff } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateEmployeeSchema, inviteEmployeeSchema } from '@/lib/validators/profile'

const TEAM_BUCKET = 'team'
const ALLOWED_AVATAR = ['image/jpeg', 'image/png', 'image/webp']

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string }

function fieldError(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? 'Skjemaet inneholder feil.'
}

/** Oppdaterer rolle, timekost, navn, telefon og aktiv-status for en ansatt. */
export async function updateEmployee(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireStaff()

  const parsed = updateEmployeeSchema.safeParse({
    id: formData.get('id'),
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
    role: formData.get('role'),
    hourly_cost: formData.get('hourly_cost'),
    active: formData.get('active'),
    title: formData.get('title'),
    bio: formData.get('bio'),
    show_on_about: formData.get('show_on_about'),
    sort_order: formData.get('sort_order') ?? 0,
  })
  if (!parsed.success) return { ok: false, error: fieldError(parsed.error) }

  const { id, ...fields } = parsed.data
  const admin = createAdminClient()

  // Avatar-opplasting (valgfritt)
  let avatarPath: string | undefined
  const avatarFile = formData.get('avatar')
  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (avatarFile.size > 5 * 1024 * 1024) {
      return { ok: false, error: 'Bildet er for stort (maks 5 MB).' }
    }
    if (avatarFile.type && !ALLOWED_AVATAR.includes(avatarFile.type)) {
      return { ok: false, error: 'Bilde må være JPG, PNG eller WEBP.' }
    }
    const ext = avatarFile.name.includes('.')
      ? avatarFile.name.split('.').pop()!.toLowerCase()
      : 'jpg'
    const path = `${id}/${crypto.randomUUID()}.${ext}`
    const buffer = Buffer.from(await avatarFile.arrayBuffer())
    const { error: upErr } = await admin.storage
      .from(TEAM_BUCKET)
      .upload(path, buffer, { contentType: avatarFile.type || 'image/jpeg', upsert: false })
    if (upErr) {
      console.error('[updateEmployee] avatar upload', upErr)
      return { ok: false, error: 'Bildet kunne ikke lastes opp.' }
    }
    // Slett tidligere bilde for ryddighet
    const { data: existing } = await admin
      .from('profiles')
      .select('avatar_path')
      .eq('id', id)
      .single()
    if (existing?.avatar_path) {
      await admin.storage.from(TEAM_BUCKET).remove([existing.avatar_path])
    }
    avatarPath = path
  }

  const baseUpdate = {
    full_name: fields.full_name ?? null,
    phone: fields.phone ?? null,
    role: fields.role,
    hourly_cost: fields.hourly_cost ?? null,
    active: fields.active,
    title: fields.title ?? null,
    bio: fields.bio ?? null,
    show_on_about: fields.show_on_about,
    sort_order: fields.sort_order,
  }
  const update = avatarPath ? { ...baseUpdate, avatar_path: avatarPath } : baseUpdate

  const { error } = await admin.from('profiles').update(update).eq('id', id)
  if (error) {
    console.error('[updateEmployee]', error)
    return { ok: false, error: 'Kunne ikke lagre endringene.' }
  }

  revalidatePath('/admin/ansatte')
  revalidateTag('team', 'max')
  revalidatePath('/om-oss')
  return { ok: true, message: 'Lagret.' }
}

/**
 * Oppretter en ny ansatt: lager auth-bruker (service-role) med satt passord og
 * bekreftet e-post, og fyller profilen med rolle/timekost. Trigger på
 * auth.users oppretter profil-raden; vi oppdaterer den etterpå.
 */
export async function inviteEmployee(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireStaff()

  const parsed = inviteEmployeeSchema.safeParse({
    email: formData.get('email'),
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
    role: formData.get('role'),
    hourly_cost: formData.get('hourly_cost'),
    password: formData.get('password'),
  })
  if (!parsed.success) return { ok: false, error: fieldError(parsed.error) }

  const admin = createAdminClient()
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.full_name },
  })

  if (createError || !created.user) {
    console.error('[inviteEmployee] createUser', createError)
    const dup = createError?.message?.toLowerCase().includes('already')
    return { ok: false, error: dup ? 'En bruker med denne e-posten finnes allerede.' : 'Kunne ikke opprette bruker.' }
  }

  const { error: profileError } = await admin
    .from('profiles')
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone ?? null,
      role: parsed.data.role,
      hourly_cost: parsed.data.hourly_cost ?? null,
      active: true,
    })
    .eq('id', created.user.id)

  if (profileError) {
    console.error('[inviteEmployee] profile update', profileError)
    return { ok: false, error: 'Bruker opprettet, men profilen kunne ikke oppdateres.' }
  }

  revalidatePath('/admin/ansatte')
  return { ok: true, message: `${parsed.data.full_name} er lagt til.` }
}

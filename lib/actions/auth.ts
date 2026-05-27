'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const credentialsSchema = z.object({
  email: z.string().trim().min(1, 'E-post er påkrevd').email('Ugyldig e-postadresse'),
  password: z.string().min(1, 'Skriv inn passord'),
})

export type SignInState = { error: string } | null

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Ugyldig innlogging' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: 'Feil e-post eller passord.' }
  }

  redirect('/admin')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

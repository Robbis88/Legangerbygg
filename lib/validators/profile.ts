import { z } from 'zod'

export const userRoleValues = ['eier', 'ansatt', 'regnskap', 'visning'] as const

export const userRoleLabels: Record<(typeof userRoleValues)[number], string> = {
  eier: 'Eier',
  ansatt: 'Ansatt',
  regnskap: 'Regnskap',
  visning: 'Visning',
}

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' || v == null ? undefined : v), schema)

const hourlyCost = emptyToUndefined(
  z.coerce
    .number({ message: 'Timekost må være et tall' })
    .min(0, 'Timekost kan ikke være negativ')
    .max(100000, 'Timekost er urimelig høy')
    .optional(),
)

export const updateEmployeeSchema = z.object({
  id: z.string().uuid(),
  full_name: emptyToUndefined(z.string().trim().max(120).optional()),
  phone: emptyToUndefined(z.string().trim().max(40).optional()),
  role: z.enum(userRoleValues),
  hourly_cost: hourlyCost,
  active: z.preprocess((v) => v === 'on' || v === 'true' || v === true, z.boolean()),
})

export const inviteEmployeeSchema = z.object({
  email: z.string().trim().min(1, 'E-post er påkrevd').email('Ugyldig e-postadresse').max(200),
  full_name: z.string().trim().min(2, 'Skriv inn fullt navn').max(120),
  phone: emptyToUndefined(z.string().trim().max(40).optional()),
  role: z.enum(userRoleValues),
  hourly_cost: hourlyCost,
  password: z.string().min(8, 'Passord må være minst 8 tegn').max(72),
})

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>
export type InviteEmployeeInput = z.infer<typeof inviteEmployeeSchema>

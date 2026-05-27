import { z } from 'zod'

import { projectTypeValues } from '@/lib/validators/inquiry'

export const projectStatusValues = ['planlegging', 'pagaende', 'pa_vent', 'ferdig'] as const

export const projectStatusLabels: Record<(typeof projectStatusValues)[number], string> = {
  planlegging: 'Planlegging',
  pagaende: 'Pågående',
  pa_vent: 'På vent',
  ferdig: 'Ferdig',
}

/** Lager en URL-vennlig slug fra en tittel (norske tegn → ascii). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' || v == null ? undefined : v), schema)

const dateStr = emptyToUndefined(
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Ugyldig dato' }).optional(),
)

export const projectSchema = z.object({
  id: emptyToUndefined(z.string().uuid().optional()),
  title: z.string().trim().min(2, 'Skriv inn en tittel').max(160),
  slug: emptyToUndefined(
    z
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/, { message: 'Kun små bokstaver, tall og bindestrek' })
      .max(80)
      .optional(),
  ),
  type: z.enum(projectTypeValues),
  status: z.enum(projectStatusValues),
  address: emptyToUndefined(z.string().trim().max(200).optional()),
  description: emptyToUndefined(z.string().trim().max(4000).optional()),
  start_date: dateStr,
  end_date: dateStr,
  estimated_hours: emptyToUndefined(
    z.coerce.number().min(0, 'Kan ikke være negativ').max(100000).optional(),
  ),
  cover_image_url: emptyToUndefined(z.string().trim().url('Ugyldig URL').max(500).optional()),
  is_public: z.preprocess((v) => v === 'on' || v === true || v === 'true', z.boolean()),
})

export type ProjectInput = z.infer<typeof projectSchema>

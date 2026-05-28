import { z } from 'zod'

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' || v == null ? undefined : v), schema)

export const hmsArticleSchema = z.object({
  id: emptyToUndefined(z.string().uuid().optional()),
  title: z.string().trim().min(2, 'Skriv en tittel').max(200),
  slug: emptyToUndefined(
    z
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/, 'Kun små bokstaver, tall og bindestrek')
      .max(80)
      .optional(),
  ),
  category: emptyToUndefined(z.string().trim().max(80).optional()),
  body: z.string().max(50_000).default(''),
  sort_order: z.coerce.number().int().min(0).max(10_000).default(0),
  published: z.preprocess((v) => v === 'on' || v === true || v === 'true', z.boolean()),
})

export type HmsArticleInput = z.infer<typeof hmsArticleSchema>

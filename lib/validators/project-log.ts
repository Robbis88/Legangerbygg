import { z } from 'zod'

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' || v == null ? undefined : v), schema)

export const logEntrySchema = z.object({
  project_id: z.string().uuid('Mangler prosjekt'),
  entry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ugyldig dato'),
  body: emptyToUndefined(z.string().trim().max(4000).optional()),
})

export type LogEntryInput = z.infer<typeof logEntrySchema>

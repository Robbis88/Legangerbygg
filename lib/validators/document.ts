import { z } from 'zod'

export const documentKindValues = ['kvittering', 'faktura', 'annet'] as const

export const documentKindLabels: Record<(typeof documentKindValues)[number], string> = {
  kvittering: 'Kvittering',
  faktura: 'Faktura',
  annet: 'Annet',
}

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' || v == null ? undefined : v), schema)

export const documentMetaSchema = z.object({
  project_id: z.string().uuid(),
  kind: z.enum(documentKindValues),
  supplier: emptyToUndefined(z.string().trim().max(160).optional()),
  amount: emptyToUndefined(
    z.coerce.number().min(0, 'Kan ikke være negativt').max(100_000_000).optional(),
  ),
  doc_date: emptyToUndefined(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ugyldig dato').optional(),
  ),
  note: emptyToUndefined(z.string().trim().max(500).optional()),
})

export type DocumentMetaInput = z.infer<typeof documentMetaSchema>

import { z } from 'zod'

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' || v == null ? undefined : v), schema)

export const quoteItemSchema = z.object({
  description: z.string().trim().min(1, 'Skriv en beskrivelse').max(400),
  quantity: z.coerce.number().min(0, 'Antall kan ikke være negativt').max(1_000_000),
  unit: emptyToUndefined(z.string().trim().max(20).optional()),
  unit_price: z.coerce.number().min(0, 'Pris kan ikke være negativ').max(100_000_000),
})

export const quoteSchema = z.object({
  id: emptyToUndefined(z.string().uuid().optional()),
  inquiry_id: emptyToUndefined(z.string().uuid().optional()),
  customer_name: z.string().trim().min(1, 'Kundenavn er påkrevd').max(160),
  customer_email: emptyToUndefined(z.string().trim().email('Ugyldig e-postadresse').optional()),
  customer_phone: emptyToUndefined(z.string().trim().max(40).optional()),
  customer_address: emptyToUndefined(z.string().trim().max(200).optional()),
  title: z.string().trim().min(1, 'Tittel er påkrevd').max(200),
  intro: emptyToUndefined(z.string().trim().max(4000).optional()),
  notes: emptyToUndefined(z.string().trim().max(4000).optional()),
  vat_rate: z.coerce.number().min(0).max(100),
  valid_until: emptyToUndefined(
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ugyldig dato').optional(),
  ),
  items: z.array(quoteItemSchema).min(1, 'Legg til minst én linje'),
})

export type QuoteFormInput = z.infer<typeof quoteSchema>

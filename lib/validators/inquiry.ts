import { z } from 'zod'

/**
 * Zod-schema for kontaktskjema. Brukes både i klient (React Hook Form-validering)
 * og i server action før vi treffer databasen. Matcher `inquiries`-tabellen og
 * `project_type`-enum i Supabase.
 *
 * preprocess-wrappers konverterer tom string til undefined slik at valgfrie
 * felter får riktig type (string | undefined) i stedet for (string | '' | undefined).
 */
export const projectTypeValues = [
  'nybygg',
  'rehabilitering',
  'totalrenovering',
  'flipp',
  'moske',
  'leilighet',
  'rekkehus',
  'prosjektledelse',
  'innvendig',
  'utvendig',
  'annet',
] as const

export const projectTypeLabels: Record<(typeof projectTypeValues)[number], string> = {
  nybygg: 'Nybygg',
  rehabilitering: 'Rehabilitering',
  totalrenovering: 'Totalrenovering',
  flipp: 'Flipp',
  moske: 'Moské-prosjekt',
  leilighet: 'Leilighet',
  rekkehus: 'Rekkehus',
  prosjektledelse: 'Prosjektledelse',
  innvendig: 'Innvendig oppussing',
  utvendig: 'Utvendig arbeid',
  annet: 'Annet / vet ikke',
}

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' || v == null ? undefined : v), schema)

export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Skriv inn fullt navn' })
    .max(120, { message: 'Navnet er for langt' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'E-post er påkrevd' })
    .email({ message: 'Ugyldig e-postadresse' })
    .max(200),
  phone: emptyToUndefined(z.string().trim().max(40, { message: 'Telefonnummer er for langt' }).optional()),
  address: emptyToUndefined(z.string().trim().max(200, { message: 'Adressen er for lang' }).optional()),
  project_type: emptyToUndefined(z.enum(projectTypeValues).optional()),
  budget: emptyToUndefined(
    z.string().trim().max(80, { message: 'Budsjettfeltet er for langt' }).optional(),
  ),
  description: z
    .string()
    .trim()
    .min(10, { message: 'Beskriv prosjektet med minst noen ord' })
    .max(4000, { message: 'Beskrivelsen er for lang' }),
  // Honeypot — botter fyller dette ut, ekte brukere lar det stå tomt
  hp: emptyToUndefined(z.string().max(0, { message: 'Ugyldig innsending' }).optional()),
})

export type InquiryInput = z.infer<typeof inquirySchema>

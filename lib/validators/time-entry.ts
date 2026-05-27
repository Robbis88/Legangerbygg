import { z } from 'zod'

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' || v == null ? undefined : v), schema)

export const timeEntrySchema = z.object({
  project_id: z.string().uuid('Velg et prosjekt'),
  profile_id: z.string().uuid('Velg en ansatt'),
  work_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ugyldig dato'),
  hours: z.coerce
    .number({ message: 'Timer må være et tall' })
    .gt(0, 'Timer må være over 0')
    .max(24, 'Maks 24 timer per dag'),
  note: emptyToUndefined(z.string().trim().max(500).optional()),
})

export const payrollSettingsSchema = z.object({
  employer_tax_pct: z.coerce.number().min(0, 'Kan ikke være negativ').max(100, 'Maks 100 %'),
  holiday_pay_pct: z.coerce.number().min(0, 'Kan ikke være negativ').max(100, 'Maks 100 %'),
  pension_pct: z.coerce.number().min(0, 'Kan ikke være negativ').max(100, 'Maks 100 %'),
})

export type TimeEntryInput = z.infer<typeof timeEntrySchema>
export type PayrollSettingsInput = z.infer<typeof payrollSettingsSchema>

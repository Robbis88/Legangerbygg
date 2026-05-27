/**
 * Lønnskost-beregning. Gjør om timelønn til reell arbeidsgiverkost ved å legge
 * på feriepenger, pensjon (OTP) og arbeidsgiveravgift (AGA).
 *
 * Formel (forenklet estimat):
 *   grunnlønn   = timelønn × timer
 *   feriepenger = grunnlønn × feriepenger%
 *   pensjon     = grunnlønn × pensjon%
 *   AGA         = (grunnlønn + feriepenger + pensjon) × AGA%
 *   total       = grunnlønn + feriepenger + pensjon + AGA
 *
 * Standard for Bergen (sone 1): AGA 14,1 %, feriepenger 12 %, OTP 2 %.
 */
export type PayrollSettings = {
  employer_tax_pct: number
  holiday_pay_pct: number
  pension_pct: number
}

export const DEFAULT_PAYROLL: PayrollSettings = {
  employer_tax_pct: 14.1,
  holiday_pay_pct: 12,
  pension_pct: 2,
}

export type LaborCost = {
  hours: number
  baseWage: number
  holidayPay: number
  pension: number
  employerTax: number
  total: number
}

export function computeLaborCost(
  hourlyWage: number,
  hours: number,
  settings: PayrollSettings,
): LaborCost {
  const baseWage = hourlyWage * hours
  const holidayPay = baseWage * (settings.holiday_pay_pct / 100)
  const pension = baseWage * (settings.pension_pct / 100)
  const employerTax = (baseWage + holidayPay + pension) * (settings.employer_tax_pct / 100)
  const total = baseWage + holidayPay + pension + employerTax
  return { hours, baseWage, holidayPay, pension, employerTax, total }
}

export function sumLaborCost(costs: LaborCost[]): LaborCost {
  return costs.reduce<LaborCost>(
    (acc, c) => ({
      hours: acc.hours + c.hours,
      baseWage: acc.baseWage + c.baseWage,
      holidayPay: acc.holidayPay + c.holidayPay,
      pension: acc.pension + c.pension,
      employerTax: acc.employerTax + c.employerTax,
      total: acc.total + c.total,
    }),
    { hours: 0, baseWage: 0, holidayPay: 0, pension: 0, employerTax: 0, total: 0 },
  )
}

const nok = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 0,
})

/** Formaterer et kronebeløp, f.eks. «12 480 kr». */
export function formatNok(value: number): string {
  return nok.format(value)
}

const hoursFmt = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1 })

export function formatHours(value: number): string {
  return `${hoursFmt.format(value)} t`
}

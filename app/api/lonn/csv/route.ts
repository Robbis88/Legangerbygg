import { NextResponse } from 'next/server'

import { requireStaff } from '@/lib/auth'
import { getLonnReport } from '@/lib/queries/lonn'
import { computeLaborCost } from '@/lib/payroll'

/**
 * CSV-eksport av timer per ansatt for en periode — beregnet for norsk Excel
 * (`;`-separator, komma-desimal, UTF-8 med BOM).
 */
export async function GET(request: Request) {
  await requireStaff()
  const url = new URL(request.url)
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const employee = url.searchParams.get('employee')

  if (!from || !to || !/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return NextResponse.json({ error: 'Ugyldig periode (krever from/to YYYY-MM-DD).' }, { status: 400 })
  }

  const report = await getLonnReport({ from, to, employeeId: employee || null })

  const nok = (n: number) => n.toFixed(2).replace('.', ',')
  const num = (n: number) => n.toString().replace('.', ',')
  const cell = (v: string | number) => {
    const s = String(v)
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }

  const rows: string[] = []
  rows.push(
    [
      'Ansatt',
      'Dato',
      'Prosjekt',
      'Timer',
      'Timelonn (kr)',
      'Grunnlonn (kr)',
      'Feriepenger (kr)',
      'Pensjon (kr)',
      'AGA (kr)',
      'Reell kost (kr)',
      'Notat',
    ].join(';'),
  )

  for (const emp of report.employees) {
    for (const e of emp.entries) {
      const cost = computeLaborCost(emp.hourlyCost, e.hours, report.settings)
      rows.push(
        [
          cell(emp.name),
          e.work_date,
          cell(e.projectTitle),
          num(e.hours),
          nok(emp.hourlyCost),
          nok(cost.baseWage),
          nok(cost.holidayPay),
          nok(cost.pension),
          nok(cost.employerTax),
          nok(cost.total),
          cell(e.note ?? ''),
        ].join(';'),
      )
    }
    // Subtotal per ansatt
    rows.push(
      [
        cell(`SUM ${emp.name}`),
        '',
        '',
        num(emp.totalHours),
        '',
        nok(emp.totalCost.baseWage),
        nok(emp.totalCost.holidayPay),
        nok(emp.totalCost.pension),
        nok(emp.totalCost.employerTax),
        nok(emp.totalCost.total),
        '',
      ].join(';'),
    )
  }

  rows.push(
    [
      'TOTALT',
      '',
      '',
      num(report.totalHours),
      '',
      nok(report.totalCost.baseWage),
      nok(report.totalCost.holidayPay),
      nok(report.totalCost.pension),
      nok(report.totalCost.employerTax),
      nok(report.totalCost.total),
      `Satser: AGA ${report.settings.employer_tax_pct} % / ferie ${report.settings.holiday_pay_pct} % / pensjon ${report.settings.pension_pct} %`,
    ].join(';'),
  )

  const body = '﻿' + rows.join('\r\n')
  const filename = `timer-${from}-til-${to}${employee ? `-${employee.slice(0, 8)}` : ''}.csv`

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}

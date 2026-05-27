import { getProjectLaborSummary } from '@/lib/queries/timer'
import { formatNok, formatHours } from '@/lib/payroll'

/**
 * Viser arbeidskost per prosjekt: timer og reell kost (inkl. feriepenger,
 * pensjon og arbeidsgiveravgift) per ansatt, samt totalsum.
 */
export async function ProjectEconomy({ projectId }: { projectId: string }) {
  const { settings, lines, total } = await getProjectLaborSummary(projectId)

  return (
    <section className="border-border bg-background space-y-5 rounded-2xl border p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Arbeidskost</h2>
        <p className="text-muted-foreground text-xs">
          AGA {settings.employer_tax_pct} % · feriepenger {settings.holiday_pay_pct} % · pensjon{' '}
          {settings.pension_pct} %
        </p>
      </div>

      {lines.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Ingen timer ført på dette prosjektet ennå. Før timer under «Timer».
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="text-muted-foreground border-border border-b text-left text-xs uppercase">
                <th className="py-2 pr-4 font-medium tracking-wide">Ansatt</th>
                <th className="py-2 pr-4 text-right font-medium tracking-wide">Timer</th>
                <th className="py-2 pr-4 text-right font-medium tracking-wide">Timelønn</th>
                <th className="py-2 pr-4 text-right font-medium tracking-wide">Grunnlønn</th>
                <th className="py-2 text-right font-medium tracking-wide">Reell kost</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {lines.map((line) => (
                <tr key={line.profileId}>
                  <td className="py-2.5 pr-4">{line.name}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{formatHours(line.cost.hours)}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{line.hourlyCost} kr/t</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{formatNok(line.cost.baseWage)}</td>
                  <td className="py-2.5 text-right font-medium tabular-nums">{formatNok(line.cost.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-border border-t-2 font-semibold">
                <td className="py-3 pr-4">Totalt</td>
                <td className="py-3 pr-4 text-right tabular-nums">{formatHours(total.hours)}</td>
                <td className="py-3 pr-4"></td>
                <td className="py-3 pr-4 text-right tabular-nums">{formatNok(total.baseWage)}</td>
                <td className="py-3 text-right tabular-nums">{formatNok(total.total)}</td>
              </tr>
            </tfoot>
          </table>
          <p className="text-muted-foreground mt-3 text-xs">
            «Reell kost» = grunnlønn + feriepenger + pensjon + arbeidsgiveravgift. Påslag fra
            grunnlønn: {formatNok(total.holidayPay)} feriepenger, {formatNok(total.pension)} pensjon,{' '}
            {formatNok(total.employerTax)} AGA.
          </p>
        </div>
      )}
    </section>
  )
}

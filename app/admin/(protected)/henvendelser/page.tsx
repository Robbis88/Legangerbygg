import type { Metadata } from 'next'
import Link from 'next/link'

import { getInquiries } from '@/lib/queries/inquiries'
import { setInquiryStatus, deleteInquiry } from '@/lib/actions/henvendelse'
import { projectTypeLabels } from '@/lib/validators/inquiry'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Henvendelser',
  robots: { index: false, follow: false },
}

const dateFmt = new Intl.DateTimeFormat('nb-NO', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Oslo',
})

export default async function HenvendelserPage() {
  const inquiries = await getInquiries()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Henvendelser</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Meldinger fra kontaktskjemaet på nettsiden. Lag tilbud direkte fra en henvendelse, eller
          marker som behandlet når den er fulgt opp.
        </p>
      </div>

      {inquiries.length === 0 ? (
        <p className="text-muted-foreground text-sm">Ingen henvendelser ennå.</p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => {
            const isNew = inq.status === 'ny'
            return (
              <article
                key={inq.id}
                className="border-border bg-background space-y-4 rounded-2xl border p-6"
              >
                <header className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">{inq.name}</h2>
                    <p className="text-muted-foreground text-xs">
                      {dateFmt.format(new Date(inq.created_at))}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase',
                      isNew ? 'bg-amber-500/15 text-amber-700' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {isNew ? 'Ny' : 'Behandlet'}
                  </span>
                </header>

                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground text-xs">E-post</dt>
                    <dd>
                      <a className="hover:underline" href={`mailto:${inq.email}`}>
                        {inq.email}
                      </a>
                    </dd>
                  </div>
                  {inq.phone ? (
                    <div>
                      <dt className="text-muted-foreground text-xs">Telefon</dt>
                      <dd>{inq.phone}</dd>
                    </div>
                  ) : null}
                  {inq.address ? (
                    <div>
                      <dt className="text-muted-foreground text-xs">Adresse</dt>
                      <dd>{inq.address}</dd>
                    </div>
                  ) : null}
                  {inq.project_type ? (
                    <div>
                      <dt className="text-muted-foreground text-xs">Type</dt>
                      <dd>{projectTypeLabels[inq.project_type]}</dd>
                    </div>
                  ) : null}
                  {inq.budget ? (
                    <div>
                      <dt className="text-muted-foreground text-xs">Budsjett</dt>
                      <dd>{inq.budget}</dd>
                    </div>
                  ) : null}
                </dl>

                <p className="bg-muted/40 border-border rounded-xl border p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {inq.description}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/tilbud/ny?inquiry=${inq.id}`}
                    className={cn(buttonVariants(), 'gap-1.5')}
                  >
                    Lag tilbud
                  </Link>
                  <form action={setInquiryStatus}>
                    <input type="hidden" name="id" value={inq.id} />
                    <input type="hidden" name="status" value={isNew ? 'behandlet' : 'ny'} />
                    <Button type="submit" variant="outline" size="sm">
                      {isNew ? 'Marker behandlet' : 'Marker ny'}
                    </Button>
                  </form>
                  <form action={deleteInquiry} className="ml-auto">
                    <input type="hidden" name="id" value={inq.id} />
                    <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
                      Slett
                    </Button>
                  </form>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

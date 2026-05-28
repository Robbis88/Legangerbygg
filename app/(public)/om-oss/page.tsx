import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import { getTeamForAbout } from '@/lib/queries/team'

export const metadata: Metadata = {
  title: 'Om oss',
  description:
    'Leganger Bygg AS er Lasse — en ung tømrer med stor pasjon for oppussing og renovering sentralt i Bergen. Full kontroll fra A til Å, med faste sertifiserte samarbeidspartnere.',
}

const values = [
  {
    label: 'Pasjon',
    body: 'Vi gjør dette fordi vi elsker det. Det merkes i hver detalj — også de du aldri kommer til å se.',
  },
  {
    label: 'Full kontroll',
    body: 'Én som styrer alt: fag, fremdrift, økonomi og samarbeidspartnere. Du forholder deg bare til oss.',
  },
  {
    label: 'Ærlighet',
    body: 'Vi lover bare det vi kan holde. Er noe utenfor vårt felt, henter vi inn sertifiserte folk vi stoler på.',
  },
  {
    label: 'Lokalt',
    body: 'Sentralt i Bergen. Vi kjenner bygårdene, sameiene og hvordan de gamle husene her er bygget.',
  },
]

const fagOgTrygghet = [
  'Fagbrev som tømrer',
  'Ansvars- og yrkesskadeforsikring',
  'Sertifisert våtromsarbeid via fast partner',
  'Faste samarbeidspartnere: rørlegger, elektriker, murer og flislegger',
]

export default async function OmOssPage() {
  const team = await getTeamForAbout()
  return (
    <>
      <section className="border-border border-b px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
            Om oss
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Oppussing med
            <br />
            full kontroll.
          </h1>
          <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
            Leganger Bygg AS er et lite firma med mye pasjon. Vi pusser opp og renoverer
            leiligheter, rekkehus og eneboliger sentralt i Bergen — og tar jobben fra A til Å.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <h2 className="text-muted-foreground mb-6 font-mono text-xs tracking-[0.3em] uppercase">
              Vår tilnærming
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-foreground/90 md:text-xl">
            <p>
              Lasse er med på hvert eneste oppdrag — fra første befaring til siste finish. Du har
              én kontakt som vet nøyaktig hva som skjer, og som svarer på telefonen.
            </p>
            <p>
              Det han ikke gjør selv, koordinerer han. Rørlegger, elektriker, murer og flislegger
              er faste folk han kan stå inne for, og våtrom utføres med sertifisert utførelse. Du
              slipper å løpe etter ti ulike telefoner.
            </p>
            <p>
              Drømmer du om å kjøpe en gammel bolig og sette ditt eget preg på den? Da er dette
              tømreren som tar deg trygt gjennom hele prosessen.
            </p>
          </div>
        </div>
      </section>

      <section className="border-border border-y bg-muted/30 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-muted-foreground mb-12 font-mono text-xs tracking-[0.3em] uppercase">
            Det vi står for
          </h2>
          <div className="grid gap-px overflow-hidden rounded-2xl border md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <div key={value.label} className="bg-background flex flex-col gap-4 p-8 md:p-10">
                <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em]">
                  0{i + 1}
                </p>
                <h3 className="text-2xl font-semibold tracking-tight">{value.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-muted-foreground mb-10 font-mono text-xs tracking-[0.3em] uppercase">
            Hvem er vi
          </h2>
          {team.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Vi presenterer oss her snart. Inntil da, ring oss eller send en melding.
            </p>
          ) : (
            <div className="grid gap-10 sm:grid-cols-2 md:gap-14">
              {team.map((member) => (
                <article key={member.id}>
                  <div className="bg-muted/40 border-border relative aspect-[4/5] w-full overflow-hidden rounded-2xl border">
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url}
                        alt={member.full_name ?? 'Portrett'}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <p className="text-muted-foreground absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-[0.3em] uppercase">
                        Portrett kommer
                      </p>
                    )}
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                    {member.full_name}
                  </h3>
                  {member.title ? (
                    <p className="text-muted-foreground mt-1 font-mono text-[11px] tracking-[0.25em] uppercase">
                      {member.title}
                    </p>
                  ) : null}
                  {member.bio ? (
                    <p className="text-foreground/85 mt-4 text-base leading-relaxed whitespace-pre-wrap">
                      {member.bio}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-border border-t px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <h2 className="text-muted-foreground mb-6 font-mono text-xs tracking-[0.3em] uppercase">
              Fag & trygghet
            </h2>
          </div>
          <ul className="space-y-4">
            {fagOgTrygghet.map((c) => (
              <li
                key={c}
                className="border-border flex items-center justify-between gap-6 border-b py-4 text-base md:text-lg"
              >
                <span>{c}</span>
                <span className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase shrink-0">
                  Aktiv
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-foreground text-background px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">
              La oss bli kjent
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Ring eller send oss en melding.
            </h2>
          </div>
          <Link
            href="/kontakt"
            className="bg-background text-foreground hover:bg-background/90 inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium tracking-wide transition-colors"
          >
            Kontakt oss
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}

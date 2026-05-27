import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Om oss',
  description:
    'Leganger Bygg AS — håndverk som tåler tid og bruk. Vi tar ansvar for hele prosjektet, fra første tegning til ferdig overlevering.',
}

const values = [
  {
    label: 'Kvalitet',
    body: 'Vi gir aldri etter på materialvalg eller utførelse. Det du ikke ser, er like nøye gjort som det du ser.',
  },
  {
    label: 'Punktlighet',
    body: 'Tidsfrister er tidsfrister. Du vet alltid når neste milepæl er, og du blir varslet før noe sklir.',
  },
  {
    label: 'Erfaring',
    body: 'Over 20 år i tømrerfaget og hundrevis av prosjekter — fra eneboliger i Bergen til moské-prosjekter og næringsbygg.',
  },
  {
    label: 'Trygghet',
    body: 'Skikkelig forsikret, sentralt godkjent og forpliktet til Bustadoppføringslova. Du vet hva du får.',
  },
]

const certifications = [
  'Sentral godkjenning som tømrer',
  'Våtromsfag — sertifisering for utførelse',
  'Bustadoppføringslova-konformt kontraktsverk',
  'Yrkesskade- og ansvarsforsikring',
]

export default function OmOssPage() {
  return (
    <>
      <section className="border-border border-b px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
            Om oss
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Håndverk som
            <br />
            tåler tid og bruk.
          </h1>
          <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
            Leganger Bygg AS ble grunnlagt med ett mål: å levere bygg du fortsatt er
            fornøyd med ti år senere. Vi tar ikke flere prosjekter enn vi kan følge tett selv.
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
              Vi tror på færre, bedre prosjekter. Det betyr at Ronny selv er involvert i hvert
              eneste oppdrag — fra første befaring til siste sluttbefaring. Du har én kontakt, én
              som vet hva som skjer og én som svarer på telefonen.
            </p>
            <p>
              Vi jobber metodisk. Tegninger gjennomgås i detalj, materialer planlegges og bestilles
              i god tid, og vi holder ryddig anlegg gjennom hele perioden. Underentreprenører er
              folk vi har jobbet med før og kan stå inne for.
            </p>
            <p>
              Vi liker komplekse prosjekter: gamle hus med karakter, moské-bygg med spesielle krav,
              flipp-prosjekter med stramt budsjett. Det er der erfaring gjør størst forskjell.
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
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <h2 className="text-muted-foreground mb-6 font-mono text-xs tracking-[0.3em] uppercase">
              Ronny
            </h2>
          </div>
          <div className="space-y-6">
            <div className="bg-muted/40 border-border flex aspect-[4/5] w-full max-w-sm items-center justify-center rounded-2xl border">
              <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
                Portrett kommer
              </p>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-foreground/90 md:text-lg">
              <p>
                Ronny Osvaag er tømrermester og daglig leder. Han har vært i bransjen i over to
                tiår og har bygget alt fra eneboliger og hytter til moské-prosjekter og
                rekkehusrenoveringer.
              </p>
              <p className="text-muted-foreground">
                Full biografi og portrett kommer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-border border-t px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <h2 className="text-muted-foreground mb-6 font-mono text-xs tracking-[0.3em] uppercase">
              Sertifiseringer
            </h2>
          </div>
          <ul className="space-y-4">
            {certifications.map((c) => (
              <li
                key={c}
                className="border-border flex items-center justify-between border-b py-4 text-base md:text-lg"
              >
                <span>{c}</span>
                <span className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
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

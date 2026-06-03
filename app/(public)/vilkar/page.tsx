import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vilkår',
  description:
    'Vilkår for bruk av Leganger Bygg AS sin nettside og for tilbud og avtaler vi inngår.',
}

const sections = [
  {
    title: 'Om vilkårene',
    body: (
      <p>
        Disse vilkårene gjelder bruk av nettsiden legangerbygg.no og for tilbud og avtaler du
        inngår med Leganger Bygg AS. Spørsmål kan rettes til{' '}
        <a className="underline" href="mailto:post@legangerbygg.no">
          post@legangerbygg.no
        </a>
        .
      </p>
    ),
  },
  {
    title: 'Tilbud og avtale',
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Tilbud er bindende for oss innenfor angitt gyldighetstid (vanligvis 30 dager).</li>
        <li>
          Avtalen anses inngått når du godkjenner tilbudet — enten med digital signering via
          lenken i e-posten, skriftlig bekreftelse, eller når arbeidet faktisk starter etter
          felles forståelse.
        </li>
        <li>
          Endringer i omfang underveis (merarbeid) avtales skriftlig — vi sender et nytt tilbud
          som du må godkjenne før arbeidet utføres.
        </li>
        <li>Pris er som angitt i tilbudet. Materialprisendringer kan forekomme ved langvarige prosjekter — varsles før kjøp.</li>
      </ul>
    ),
  },
  {
    title: 'Vårt ansvar',
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Vi tar fullt ansvar for tømrerarbeidet vi utfører selv, og at det er i tråd med
          gjeldende byggeforskrifter (TEK17 m.v.) der det er aktuelt.
        </li>
        <li>
          Underleverandører — rørlegger, elektriker, murer, flislegger — har eget faglig og
          juridisk ansvar for sitt fagområde. Vi koordinerer dem på vegne av deg.
        </li>
        <li>
          Vi har ordinær ansvars- og yrkesskadeforsikring som dekker skader vi måtte forårsake
          under arbeidet.
        </li>
      </ul>
    ),
  },
  {
    title: 'Reklamasjon og klage',
    body: (
      <p>
        Oppdager du feil eller mangler, ta kontakt på{' '}
        <a className="underline" href="mailto:post@legangerbygg.no">
          post@legangerbygg.no
        </a>
        . Vi vil løse det. For arbeid på bolig kan reklamasjonsretten etter
        bustadoppføringslova/forbrukerkjøpsloven gjelde der det er relevant.
      </p>
    ),
  },
  {
    title: 'Personvern',
    body: (
      <p>
        Behandling av personopplysninger er beskrevet i{' '}
        <a className="underline" href="/personvern">
          personvernerklæringen
        </a>
        .
      </p>
    ),
  },
  {
    title: 'Endringer i vilkårene',
    body: (
      <p>
        Vi kan oppdatere vilkårene. Gjeldende versjon vises alltid her. Sist oppdatert: 3. juni
        2026.
      </p>
    ),
  },
  {
    title: 'Lovvalg og verneting',
    body: (
      <p>
        Avtalen reguleres av norsk rett. Eventuelle tvister søkes løst i minnelighet. Hvis det
        ikke lykkes, kan saken bringes inn for norske domstoler med Bergen tingrett som verneting.
      </p>
    ),
  },
]

export default function VilkarPage() {
  return (
    <>
      <section className="border-border border-b px-6 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
            Vilkår
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
            Klare rammer. Ingen overraskelser.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed">
            Hva som gjelder for tilbud, avtaler og ansvar når du engasjerer Leganger Bygg AS.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-12">
          {sections.map((s) => (
            <div key={s.title} className="space-y-3">
              <h2 className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
                {s.title}
              </h2>
              <div className="text-foreground/85 space-y-3 text-base leading-relaxed">
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

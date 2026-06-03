import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Personvern',
  description:
    'Slik håndterer Leganger Bygg AS personopplysninger fra kontaktskjema, tilbud og driftssystem.',
}

const sections = [
  {
    title: 'Behandlingsansvarlig',
    body: (
      <>
        <p>Leganger Bygg AS er behandlingsansvarlig for personopplysningene som samles inn via
        nettsiden og i forbindelse med våre tjenester.</p>
        <p>Kontakt:{' '}
          <a className="underline" href="mailto:post@legangerbygg.no">
            post@legangerbygg.no
          </a>{' '}
          ·{' '}
          <a className="underline" href="tel:+4748866516">
            488 66 516
          </a>
        </p>
      </>
    ),
  },
  {
    title: 'Hva vi samler inn',
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Kontaktskjema:</strong> navn, e-post, telefon, adresse, prosjekttype og din
          beskrivelse av prosjektet.
        </li>
        <li>
          <strong>Tilbud:</strong> kundens kontaktinformasjon, beskrivelse av oppdrag og
          linjeposter (det du fyller inn).
        </li>
        <li>
          <strong>Signering av tilbud:</strong> navnet du signerer med, tidspunkt og IP-adresse —
          dette er juridisk dokumentasjon på at tilbudet er godkjent.
        </li>
        <li>
          <strong>Ansatte i driftssystemet:</strong> navn, e-post, telefon, timekost og
          arbeidstimer.
        </li>
      </ul>
    ),
  },
  {
    title: 'Hvorfor vi samler inn',
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Svare på henvendelser og lage tilbud.</li>
        <li>Dokumentere inngåtte avtaler.</li>
        <li>Drifte prosjekter, føre timer og fakturere ansvarlig.</li>
        <li>Oppfylle lovpålagte krav (bokføringsloven, regnskapsloven).</li>
      </ul>
    ),
  },
  {
    title: 'Hvor lenge vi lagrer',
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Henvendelser uten oppfølging: slettes innen 12 måneder.</li>
        <li>Tilbud og avtaler: beholdes i fem år iht. bokføringsloven.</li>
        <li>Ansatt- og lønnsdata: beholdes så lenge det er nødvendig, deretter slettes/anonymiseres.</li>
      </ul>
    ),
  },
  {
    title: 'Hvem ser dataene',
    body: (
      <p>
        Kun ansatte i Leganger Bygg AS med tjenstlig behov. Vi deler ikke personopplysninger med
        tredjeparter for markedsføring. Underleverandører (rørlegger, elektriker, flislegger) får
        kun nødvendig prosjektinformasjon.
      </p>
    ),
  },
  {
    title: 'Lagring og leverandører (databehandlere)',
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Supabase</strong> (EU/Tyskland) — database, autentisering og fillagring.
        </li>
        <li>
          <strong>Vercel</strong> (EU) — hosting av nettsiden.
        </li>
        <li>
          <strong>Domeneshop</strong> (Norge) — e-postutsending fra post@legangerbygg.no.
        </li>
      </ul>
    ),
  },
  {
    title: 'Cookies',
    body: (
      <p>
        Vi bruker kun nødvendige cookies for innlogging i driftssystemet. Vi sporer deg ikke for
        markedsføring og bruker ikke analyseverktøy som Google Analytics eller Facebook Pixel på
        denne siden.
      </p>
    ),
  },
  {
    title: 'Dine rettigheter',
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Innsyn</strong> — be om kopi av opplysningene vi har om deg.
        </li>
        <li>
          <strong>Retting</strong> — be oss korrigere feil.
        </li>
        <li>
          <strong>Sletting</strong> — be om å bli slettet (med unntak av det vi må beholde etter
          bokføringsloven).
        </li>
        <li>
          <strong>Klage</strong> — du kan klage til Datatilsynet (datatilsynet.no).
        </li>
        <li>
          Send forespørsel til{' '}
          <a className="underline" href="mailto:post@legangerbygg.no">
            post@legangerbygg.no
          </a>{' '}
          — vi svarer innen 30 dager.
        </li>
      </ul>
    ),
  },
  {
    title: 'Endringer',
    body: (
      <p>
        Vi kan oppdatere denne erklæringen. Vesentlige endringer varsles på denne siden. Sist
        oppdatert: 3. juni 2026.
      </p>
    ),
  },
]

export default function PersonvernPage() {
  return (
    <>
      <section className="border-border border-b px-6 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
            Personvern
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
            Slik tar vi vare på opplysningene dine.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed">
            Vi samler kun det vi trenger for å gjøre jobben — og vi forteller deg hva, hvorfor og
            hvor lenge.
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

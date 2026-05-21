import type { Metadata } from 'next'

import { KontaktForm } from '@/components/kontakt-form'

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Ta kontakt med Tømrer Ronny Osvaag AS — fortell om prosjektet ditt, så tar vi kontakt innen én virkedag.',
}

export default function KontaktPage() {
  return (
    <>
      <section className="border-border border-b px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
            Kontakt
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Snakk med oss.
          </h1>
          <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
            Fortell om prosjektet — type arbeid, tidsplan, omfang, budsjett. Jo mer du deler, jo
            bedre kan vi forberede en god dialog. Vi svarer innen én virkedag.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1.4fr_1fr] md:gap-24">
          <div>
            <KontaktForm />
          </div>

          <aside className="space-y-10">
            <div>
              <h2 className="text-muted-foreground mb-4 font-mono text-xs tracking-[0.3em] uppercase">
                Direkte
              </h2>
              <ul className="space-y-3 text-base">
                <li className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Firma</span>
                  <span>Tømrer Ronny Osvaag AS</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Lokasjon</span>
                  <span>Bergen</span>
                </li>
                <li className="text-muted-foreground text-xs">
                  Telefon og e-post legges inn senere
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-muted-foreground mb-4 font-mono text-xs tracking-[0.3em] uppercase">
                Slik jobber vi
              </h2>
              <ol className="space-y-4 text-sm leading-relaxed">
                <li>
                  <span className="text-muted-foreground font-mono text-[10px] tracking-[0.3em]">
                    01
                  </span>
                  <p className="mt-1">
                    Du forteller om prosjektet i skjemaet eller på telefon.
                  </p>
                </li>
                <li>
                  <span className="text-muted-foreground font-mono text-[10px] tracking-[0.3em]">
                    02
                  </span>
                  <p className="mt-1">Vi gjør en uforpliktende befaring og blir kjent.</p>
                </li>
                <li>
                  <span className="text-muted-foreground font-mono text-[10px] tracking-[0.3em]">
                    03
                  </span>
                  <p className="mt-1">
                    Du får et tydelig tilbud med materialvalg, fremdrift og pris.
                  </p>
                </li>
                <li>
                  <span className="text-muted-foreground font-mono text-[10px] tracking-[0.3em]">
                    04
                  </span>
                  <p className="mt-1">Vi setter i gang når du er klar — på den måten vi avtalte.</p>
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

/**
 * Tjenester Leganger Bygg AS tilbyr. Statisk innhold — endres ved å redigere
 * denne fila og deploye. Slug-feltet brukes som URL-segment under
 * /tjenester/[slug].
 *
 * Profil: oppussing og renovering sentralt i Bergen. Lasse tar tømrerarbeidet
 * og full koordinering; våtrom, el, rør, mur og flis løses med faste,
 * sertifiserte samarbeidspartnere. Ingen overdrevne påstander om egne papirer.
 */
export type Service = {
  slug: string
  title: string
  /** Kort selger-setning, brukt på kort i grid og som meta-description */
  summary: string
  /** Full beskrivelse, vises på detaljsiden */
  description: string
  /** 3–5 stikkord/punktlister på detaljsiden */
  highlights: string[]
  /** Tagline-aktig kategorisering vist over tittelen */
  kicker: string
}

export const services: Service[] = [
  {
    slug: 'leiligheter',
    title: 'Oppussing av leilighet',
    kicker: 'Sentralt i Bergen',
    summary:
      'Helhetlig oppussing av leiligheter — fra friske overflater til full ombygging av planløsning, kjøkken og bad.',
    description:
      'Leiligheter har sine egne premisser: bærevegger, sjakter, naboer og sameie. Vi tar hånd om alt fra demontering til ferdig listverk, koordinerer rørlegger og elektriker, og holder ryddig anlegg gjennom hele perioden. Du har én kontakt fra start til slutt — og en tømrer som faktisk svarer på telefonen.',
    highlights: [
      'Nytt kjøkken og oppgradert bad',
      'Nye gulv, vegger, listverk og overflater',
      'Mer lys, bedre flyt og smartere lagring',
      'Vi rydder etter oss hver dag',
    ],
  },
  {
    slug: 'rekkehus',
    title: 'Oppussing av rekkehus',
    kicker: 'Bolig med naboer',
    summary:
      'Oppussing og oppgradering av rekkehus til moderne standard — uten å rokke ved det som deles med naboen.',
    description:
      'Rekkehus krever sin egen omtanke. Bygningskroppen deles med naboer, og lydskille og fellesvegger må håndteres riktig. Vi oppgraderer rom for rom eller hele boligen, og kjenner de praktiske utfordringene med å jobbe i tett bebyggelse. Vi holder dialogen ryddig med både deg og naboene.',
    highlights: [
      'Kjøkken, bad og oppholdsrom',
      'Nye gulv, overflater og listverk',
      'Hensyn til lydskille og fellesvegger',
      'Erfaring med både eldre og nyere rekkehus',
    ],
  },
  {
    slug: 'eneboliger',
    title: 'Renovering av enebolig',
    kicker: 'Hele huset',
    summary:
      'Oppussing og renovering av eneboliger — ett rom om gangen eller hele huset, mens du bor der eller før innflytting.',
    description:
      'Vi pusser opp eneboliger med fokus på det som faktisk hever boligen: kjøkken og bad, lys og planløsning, gulv og overflater. Vi planlegger fremdriften slik at hverdagen din fungerer underveis, og koordinerer rørlegger, elektriker og flislegger der det trengs. Du vet alltid hvor prosjektet står.',
    highlights: [
      'Kjøkken, bad, gulv og overflater',
      'Smartere planløsning og mer lys',
      'Fremdrift tilpasset om du bor der underveis',
      'Utvendig: kledning, tak og terrasse ved behov',
    ],
  },
  {
    slug: 'totalrenovering',
    title: 'Totalrenovering',
    kicker: 'Strippet og bygget opp',
    summary:
      'En komplett gjenoppbygging av en eksisterende bolig — vegger, gulv, tak, bad, kjøkken og tekniske anlegg.',
    description:
      'Totalrenovering er for deg som vil ha et helt nytt hjem uten å flytte. Vi river ned til bærende konstruksjon og bygger opp på nytt med moderne løsninger. Tømrerarbeidet og prosjektstyringen står vi for; våtrom, el og rør utføres av faste, sertifiserte samarbeidspartnere. Resultatet er en bolig som ser ut og fungerer som ny — med det opprinnelige preget bevart der du ønsker det.',
    highlights: [
      'Fra romplan til ferdig innredet',
      'Oppgradering av el, rør, ventilasjon og isolasjon',
      'Sertifisert våtromsarbeid via fast partner',
      'Klare milepæler og forutsigbar økonomi',
    ],
  },
  {
    slug: 'flipp',
    title: 'Oppussingsprosjekter & flipp',
    kicker: 'Verdi gjennom oppussing',
    summary:
      'Strategisk oppussing av leiligheter, rekkehus og eneboliger for videresalg — med stram budsjettstyring og blikk for hva som selger.',
    description:
      'Lasse har kjøpt, pusset opp og solgt en rekke boliger selv, og vet hvilke tiltak som faktisk øker verdien: kjøkken og bad, lys og planløsning, gulv og overflater. Vi gjør om en sliten eiendom til en attraktiv bolig — raskt, med kontroll på budsjett og frister. Drømmer du om å kjøpe et oppussingsobjekt, tar vi deg trygt gjennom hele prosessen.',
    highlights: [
      'Budsjettstyring fra dag én',
      'Materialvalg som balanserer pris og inntrykk',
      'Rask gjennomføring med klare milepæler',
      'Salgs- og styling-vennlige løsninger',
    ],
  },
  {
    slug: 'bad-kjokken',
    title: 'Bad & kjøkken',
    kicker: 'Med sertifiserte partnere',
    summary:
      'Nye bad og kjøkken — vi står for tømrerarbeidet og koordinerer sertifisert rørlegger og flislegger.',
    description:
      'Bad og kjøkken er rommene som løfter hele boligen mest. Vi tar hånd om tømrerarbeid, innredning, montering og listverk, og koordinerer faste samarbeidspartnere for våtromsmembran, rør, fliser og el. Du forholder deg til oss — vi sørger for at fagene henger sammen og at det blir gjort etter forskriftene.',
    highlights: [
      'Kjøkken — fra Ikea til skreddersydd',
      'Bad med sertifisert våtromsutførelse via partner',
      'Skjult belysning og gjennomtenkte detaljer',
      'Materialer som tåler bruk over tid',
    ],
  },
  {
    slug: 'tomrerarbeid',
    title: 'Tømrerarbeid & andre oppdrag',
    kicker: 'Faget fra A til Å',
    summary:
      'Vanlig tømrerarbeid utover oppussing — kledning, tak, terrasser, vinduer, dører, vegger og listverk.',
    description:
      'Trenger du en tømrer til en avgrenset jobb? Vi tar de fleste oppdrag innenfor faget: utvendig kledning og tak, terrasser og rekkverk, utskifting av vinduer og dører, nye vegger, himlinger og listverk. Ryddig utført, til avtalt tid, med en utførelse som står seg i bergensk klima.',
    highlights: [
      'Trekledning, tak og terrasser',
      'Vinduer og dører — komplett utskifting',
      'Vegger, himling og listverk',
      'Mindre, avgrensede oppdrag tas også',
    ],
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}

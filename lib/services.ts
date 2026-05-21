/**
 * Tjenester Troas Bygg tilbyr. Statisk innhold — endres ved å redigere
 * denne fila og deploye. Slug-feltet brukes som URL-segment under
 * /tjenester/[slug].
 *
 * Når Robert har gjennomgått tekstene, justeres summary og description
 * her, og highlights kan utvides per tjeneste.
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
    slug: 'nybygg',
    title: 'Nybygg',
    kicker: 'Bygg fra grunnen',
    summary:
      'Vi bygger boliger og næringsbygg fra første spadestikk til ferdig overlevering — med fokus på presisjon, materialvalg og varig kvalitet.',
    description:
      'Når du skal bygge nytt, er hvert valg viktig. Vi tar ansvar for hele prosessen: planlegging, tegning, materialvalg, fundament, råbygg, innredning og finish. Vi jobber med erfarne arkitekter, ingeniører og leverandører for å levere et bygg som står seg over tid.',
    highlights: [
      'Enebolig, hytte og næringsbygg',
      'Komplett prosjektledelse fra tegning til nøkkelferdig',
      'Tett dialog underveis — du vet alltid hvor prosjektet står',
      'Norske kvalitetsmaterialer og dokumenterte leverandører',
      'Garanti i henhold til Bustadoppføringslova',
    ],
  },
  {
    slug: 'totalrenovering',
    title: 'Totalrenovering',
    kicker: 'Helhetlig fornyelse',
    summary:
      'En komplett gjenoppbygging av eksisterende bolig — vegger, gulv, tak, bad, kjøkken og tekniske anlegg.',
    description:
      'Totalrenovering er for deg som vil ha et helt nytt hjem uten å flytte. Vi river ned til bærende konstruksjoner og bygger opp på nytt med moderne løsninger for isolasjon, ventilasjon, varme og våtrom. Resultatet er en bolig som ser ut og fungerer som ny.',
    highlights: [
      'Fra romplan til ferdig innredet',
      'Oppgradering av el, rør, ventilasjon og isolasjon',
      'Våtromsfag med tilhørende sertifisering',
      'Tett samarbeid med interiørarkitekt ved ønske',
      'Klare milepæler og fast pris der det er mulig',
    ],
  },
  {
    slug: 'rehabilitering',
    title: 'Rehabilitering',
    kicker: 'Bevar karakteren',
    summary:
      'Skånsom oppgradering av eldre bygg — vi tar vare på det opprinnelige uttrykket samtidig som standarden løftes til dagens nivå.',
    description:
      'Eldre bygg har en karakter som er verdt å ta vare på. Vi rehabiliterer på en måte som respekterer historien: originale paneler, profiler og detaljer beholdes der det er mulig, mens skjult struktur, isolasjon og tekniske anlegg moderniseres. Vi har erfaring med både privatboliger og bevaringsverdige bygg.',
    highlights: [
      'Variert erfaring med trekonstruksjoner fra ulike epoker',
      'Forsiktig demontering og gjenbruk av materialer',
      'Energi- og fuktoppgradering uten å skade karakteren',
      'Tett dialog med antikvariske myndigheter ved behov',
    ],
  },
  {
    slug: 'flipp',
    title: 'Flipp',
    kicker: 'Verdi gjennom oppussing',
    summary:
      'Strategisk oppussing av leiligheter, rekkehus og eneboliger for videresalg — med stram budsjettstyring og markedsforståelse.',
    description:
      'Vi gjør om en eldre eller slitt eiendom til en attraktiv bolig som selger raskt. Vårt fokus er på de tiltakene som faktisk øker markedsverdien: kjøkken og bad, lys og planløsning, gulv og overflater. Vi har egen erfaring med eiendomsinvestering og forstår både kostnadssiden og kjøpernes forventninger.',
    highlights: [
      'Budsjettstyring fra dag én',
      'Materialvalg som balanserer pris og inntrykk',
      'Rask gjennomføring med klare milepæler',
      'Styling-vennlige planløsninger',
    ],
  },
  {
    slug: 'rekkehus',
    title: 'Rekkehus',
    kicker: 'Spesialist på tett-bebyggelse',
    summary:
      'Oppussing og rehabilitering av rekkehus med spesiell hensyn til lydforhold, brannskiller og naboforhold.',
    description:
      'Rekkehus krever sin egen kompetanse. Bygningskroppen deles med naboer, og både lydisolasjon, brannskillevegger og fellesarealer må håndteres riktig. Vi har bygget om mange rekkehus og kjenner både de tekniske kravene og de praktiske utfordringene med å jobbe i tett bebyggelse.',
    highlights: [
      'Lydisolering mellom boenheter',
      'Brannskiller i henhold til TEK17',
      'Hensyn til nabovarsler og uteareal',
      'Erfaring med både eldre og nyere rekkehus',
    ],
  },
  {
    slug: 'leiligheter',
    title: 'Leiligheter',
    kicker: 'Fornyelse innenfor rammene',
    summary:
      'Renovering av leiligheter med fokus på lys, lagring og smarte løsninger på begrenset plass.',
    description:
      'En leilighet har sine egne premisser — bærende vegger, sjakter, fellesinstallasjoner. Vi finner løsninger som gir mer lys, bedre flyt og smartere lagring uten å bryte byggets struktur. Vi tar oss av søknader til sameiet og forholder oss til borettslag og styrer.',
    highlights: [
      'Åpne planløsninger der det er forsvarlig',
      'Skreddersydd innredning og garderober',
      'Bad og kjøkken med moderne standard',
      'Søknadshjelp mot sameie og kommune',
    ],
  },
  {
    slug: 'prosjektledelse',
    title: 'Prosjektledelse',
    kicker: 'Én kontakt for hele prosjektet',
    summary:
      'Vi styrer entreprenører, leverandører, søknader og fremdrift slik at du har én kontakt for hele byggeprosjektet.',
    description:
      'For større prosjekter med flere fag tar vi rollen som hovedansvarlig. Vi koordinerer rørlegger, elektriker, malere og andre underentreprenører, holder fremdrift og økonomi i orden, og er din motpart fra første møte til ferdigbefaring. Du slipper å løpe etter ti ulike telefoner.',
    highlights: [
      'Helhetlig fremdrifts- og kostnadsstyring',
      'Søknadsarbeid mot kommune og fagmyndigheter',
      'Underentreprenører er kvalitetssikret og kjent for oss',
      'Jevnlig rapportering med bilder og status',
    ],
  },
  {
    slug: 'innvendig',
    title: 'Innvendig oppussing',
    kicker: 'Rom for rom',
    summary:
      'Bad, kjøkken, stue, soverom — vi pusser opp innvendig med fokus på materialvalg, detaljer og tekniske løsninger.',
    description:
      'Skal du pusse opp ett eller flere rom? Vi tar hånd om alt fra demontering til ferdig listverk: rør og el, gulv og fliser, vegger og himling, innredning og belysning. Vi koordinerer fag og holder ryddig anlegg gjennom hele perioden.',
    highlights: [
      'Våtrom med sertifisert utførelse',
      'Kjøkken — fra Ikea til skreddersydd',
      'Skjult belysning og tekniske detaljer',
      'Materialer som tåler bruk over tid',
    ],
  },
  {
    slug: 'utvendig',
    title: 'Utvendig arbeid',
    kicker: 'Fasade, tak, terrasse',
    summary:
      'Utvendige tømrer- og overflatearbeider: kledning, tak, terrasser, vinduer og innganger.',
    description:
      'Utvendig arbeid handler om både estetikk og bygningskropp — riktig materialvalg, riktig dampåpning, riktig dekking. Vi tar hånd om kledning, tak, terrasser, vinduer, dører og innganger med en utførelse som står seg i norsk klima.',
    highlights: [
      'Trekledning, plater og kombinasjoner',
      'Tak: nedrigging, undertak, dekke',
      'Terrasser og altanrekkverk i tre eller komposit',
      'Vinduer og dører — komplett utskifting',
    ],
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}

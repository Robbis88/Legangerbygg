/**
 * Engangs re-seed av prosjekter, prosjektbilder og anmeldelser.
 *
 * Hvorfor: den opprinnelige seedingen ble limt inn i SQL-editoren med feil
 * tegnsett (UTF-8 tolket som DOS-kodeside) -> mojibake i databasen, pluss
 * duplikater fra flere kjøringer. Dette skriptet sletter alt og setter inn
 * rent, persona-riktig innhold (Lasse / Leganger Bygg AS) over HTTP, som er
 * UTF-8-trygt.
 *
 * Kjør: node scripts/reseed-content.mjs
 * Leser NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY fra .env.local.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const env = Object.fromEntries(
  readFileSync(join(root, '.env.local'), 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i), l.slice(i + 1)]
    }),
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const NONE = '00000000-0000-0000-0000-000000000000'

const projects = [
  {
    slug: 'rekkehus-landas',
    title: 'Rekkehus på Landås',
    type: 'rekkehus',
    status: 'pagaende',
    address: 'Landås, Bergen',
    description:
      'Pågående oppussing av et rekkehus fra 80-tallet. Nytt kjøkken, oppfrisket bad, nye gulv og overflater gjennomgående — med hensyn til lydskille mot naboene. Forventet ferdig høsten 2026.',
    start_date: '2026-03-02',
    end_date: null,
    cover_image_url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&q=80',
    published_at: '2026-03-15T10:00:00Z',
    images: [
      { url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&q=80' },
      { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80' },
    ],
  },
  {
    slug: 'flipp-laksevag',
    title: 'Flipp på Laksevåg',
    type: 'flipp',
    status: 'ferdig',
    address: 'Laksevåg, Bergen',
    description:
      'Treroms kjøpt for oppussing og videresalg. Stue og kjøkken ble åpnet opp, nytt bad (med sertifisert rørlegger og flislegger), og nye overflater gjennomgående. Solgt over takst kort tid etter visning.',
    start_date: '2025-01-13',
    end_date: '2025-03-21',
    cover_image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',
    published_at: '2025-04-15T10:00:00Z',
    images: [
      { url: 'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=1600&q=80', is_before: true },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80', is_after: true },
      { url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1600&q=80', is_after: true },
    ],
  },
  {
    slug: 'totalrenovering-sandviken',
    title: 'Totalrenovering i Sandviken',
    type: 'totalrenovering',
    status: 'ferdig',
    address: 'Sandviken, Bergen',
    description:
      'Et eldre trehus i Sandviken ble strippet ned til bærende konstruksjon og bygget opp igjen: ny planløsning, etterisolering, nytt kjøkken og bad. Det originale preget er bevart der det lot seg gjøre.',
    start_date: '2024-09-02',
    end_date: '2025-03-14',
    cover_image_url: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600&q=80',
    published_at: '2025-04-10T10:00:00Z',
    images: [
      { url: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600&q=80' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80' },
    ],
  },
  {
    slug: 'leilighet-mohlenpris',
    title: 'Leilighet på Møhlenpris',
    type: 'leilighet',
    status: 'ferdig',
    address: 'Møhlenpris, Bergen',
    description:
      'Total oppussing av en toroms fra 1909. Nytt kjøkken, oppgradert bad (utført med sertifisert rørlegger og flislegger), nye eikegulv, listverk og full overflatebehandling. Ferdig på sju uker.',
    start_date: '2025-02-03',
    end_date: '2025-03-24',
    cover_image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',
    published_at: '2025-04-01T10:00:00Z',
    images: [
      { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80' },
      { url: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1600&q=80' },
    ],
  },
  {
    slug: 'enebolig-fana',
    title: 'Enebolig i Fana',
    type: 'rehabilitering',
    status: 'ferdig',
    address: 'Fana, Bergen',
    description:
      'Oppussing av en enebolig fra 70-tallet mens familien bodde der: nytt kjøkken, to oppgraderte bad, nye gulv og maling gjennomgående, samt ny terrasse. Fremdriften ble lagt opp slik at hverdagen fungerte underveis.',
    start_date: '2024-05-06',
    end_date: '2024-09-27',
    cover_image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
    published_at: '2024-10-15T10:00:00Z',
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80' },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80' },
    ],
  },
]

const reviews = [
  {
    slug: 'leilighet-mohlenpris',
    customer_name: 'Eirik H., Møhlenpris',
    rating: 5,
    body: 'Lasse pusset opp leiligheten vår fra A til Å. Ung, men utrolig dyktig og ryddig — vi visste alltid hva som skjedde. Han hadde full kontroll på både rørlegger og flislegger, og resultatet ble bedre enn vi håpet på.',
  },
  {
    slug: 'totalrenovering-sandviken',
    customer_name: 'Linn-Mari S., Sandviken',
    rating: 5,
    body: 'Vi drømte om å sette vårt eget preg på et gammelt hus i Sandviken. Lasse skjønte umiddelbart hva vi var ute etter, og tok oss trygt gjennom hele prosessen. Anbefales på det varmeste.',
  },
  {
    slug: 'flipp-laksevag',
    customer_name: 'Anders K., investor',
    rating: 5,
    body: 'Jeg har brukt Lasse på flere oppussingsprosjekter. Han holder budsjett og frister, og kvaliteten gjør at leilighetene selger raskt. Jobber gjerne med ham igjen.',
  },
  {
    slug: 'enebolig-fana',
    customer_name: 'Marianne T., Fana',
    rating: 4,
    body: 'Hele huset ble pusset opp mens vi bodde her, og Lasse holdt det ryddig og forutsigbart hele veien. Veldig fornøyd med både kjøkkenet og badene.',
  },
  {
    slug: 'rekkehus-landas',
    customer_name: 'Geir og Wenche, Landås',
    rating: 5,
    body: 'Lasse er ærlig på hva han gjør selv og hva han henter inn fag på. Det skaper trygghet. Lett å ha med å gjøre, og han svarer alltid på telefonen.',
  },
]

function die(label, error) {
  if (error) {
    console.error(`✖ ${label}:`, error.message ?? error)
    process.exit(1)
  }
}

console.log('Sletter eksisterende anmeldelser, prosjektbilder og prosjekter…')
die('slett reviews', (await supabase.from('reviews').delete().neq('id', NONE)).error)
die('slett project_images', (await supabase.from('project_images').delete().neq('id', NONE)).error)
die('slett projects', (await supabase.from('projects').delete().neq('id', NONE)).error)

console.log('Setter inn prosjekter…')
const slugToId = {}
for (const p of projects) {
  const { images, ...row } = p
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...row, is_public: true })
    .select('id, slug')
    .single()
  die(`insert project ${p.slug}`, error)
  slugToId[data.slug] = data.id

  const imageRows = images.map((img, i) => ({
    project_id: data.id,
    url: img.url,
    sort_order: i + 1,
    is_before: img.is_before ?? false,
    is_after: img.is_after ?? false,
  }))
  die(`insert images ${p.slug}`, (await supabase.from('project_images').insert(imageRows)).error)
  console.log(`  ✓ ${p.title} (${images.length} bilder)`)
}

console.log('Setter inn anmeldelser…')
const reviewRows = reviews.map((r) => ({
  customer_name: r.customer_name,
  rating: r.rating,
  body: r.body,
  project_id: slugToId[r.slug],
  published: true,
}))
die('insert reviews', (await supabase.from('reviews').insert(reviewRows)).error)
console.log(`  ✓ ${reviewRows.length} anmeldelser`)

console.log('\nFerdig. Re-seeding fullført med ren UTF-8.')

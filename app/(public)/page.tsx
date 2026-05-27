import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'

import { getPublishedProjects } from '@/lib/queries/projects'
import { getPublishedReviews } from '@/lib/queries/reviews'
import { services } from '@/lib/services'
import { generalContractorJsonLd, jsonLdScriptProps } from '@/lib/structured-data'
import type { Database } from '@/types/supabase'

const heroImage = 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=2400&q=80'

const typeLabels: Record<Database['public']['Enums']['project_type'], string> = {
  nybygg: 'Nybygg',
  rehabilitering: 'Rehabilitering',
  totalrenovering: 'Totalrenovering',
  flipp: 'Flipp',
  moske: 'Moské',
  leilighet: 'Leilighet',
  rekkehus: 'Rekkehus',
  prosjektledelse: 'Prosjektledelse',
  innvendig: 'Innvendig',
  utvendig: 'Utvendig',
  annet: 'Annet',
}

const featuredServiceSlugs = ['nybygg', 'totalrenovering', 'rehabilitering', 'prosjektledelse']

export default async function Home() {
  const [projects, reviews] = await Promise.all([
    getPublishedProjects(),
    getPublishedReviews(3),
  ])

  const featuredProjects = projects.slice(0, 3)
  const featuredServices = services.filter((s) => featuredServiceSlugs.includes(s.slug))
  const reviewAverage =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  return (
    <>
      <script
        {...jsonLdScriptProps(
          generalContractorJsonLd({
            reviewCount: reviews.length,
            ratingAverage: reviewAverage,
          }),
        )}
      />
      <Hero />
      <TaglineSection />
      <ServicesStrip services={featuredServices} />
      <FeaturedProjects projects={featuredProjects} />
      <ReviewsGlimpse reviews={reviews} average={reviewAverage} />
      <CtaBanner />
    </>
  )
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden text-white">
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start px-6 pt-32 pb-20 md:pt-44 md:pb-32">
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-80">
          Leganger Bygg AS — Bergen
        </p>
        <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl lg:text-[5.5rem] lg:leading-[1.05]">
          Vi bygger det
          <br />
          som skal stå.
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed opacity-85 md:text-lg">
          Premium tømrerfag på Vestlandet — nybygg, totalrenovering, rehabilitering og
          prosjektledelse. Du har én kontakt, og du vet alltid hvor prosjektet står.
        </p>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/prosjekter"
            className="bg-white text-black hover:bg-white/90 inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium tracking-wide transition-colors"
          >
            Se prosjekter
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/kontakt"
            className="border-white/30 text-white hover:bg-white/10 inline-flex items-center gap-2 rounded-full border px-7 py-4 text-sm font-medium tracking-wide backdrop-blur-sm transition-colors"
          >
            Få et tilbud
          </Link>
        </div>
      </div>
      <div className="absolute right-6 bottom-8 hidden font-mono text-[10px] tracking-[0.3em] uppercase opacity-60 md:block">
        Kvalitet i hvert prosjekt
      </div>
    </section>
  )
}

function TaglineSection() {
  return (
    <section className="border-border border-b px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
        <h2 className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
          Om oss
        </h2>
        <div className="space-y-8">
          <p className="text-3xl leading-tight tracking-tight text-foreground md:text-5xl">
            Færre, bedre prosjekter. Vi tar ikke flere oppdrag enn vi kan følge tett selv.
          </p>
          <p className="text-muted-foreground max-w-2xl text-base leading-relaxed md:text-lg">
            Ronny er involvert i hvert eneste prosjekt. Underentreprenører er folk vi kjenner og
            kan stå inne for. Materialvalg, fremdrift og dialog holder samme standard fra første
            befaring til siste sluttbefaring.
          </p>
          <Link
            href="/om-oss"
            className="text-foreground hover:text-foreground/80 inline-flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors"
          >
            Bli kjent med oss
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ServicesStrip({
  services,
}: {
  services: Array<{ slug: string; title: string; kicker: string; summary: string }>
}) {
  return (
    <section className="border-border border-b bg-muted/30 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
              Tjenester
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
              Hva vi gjør best.
            </h2>
          </div>
          <Link
            href="/tjenester"
            className="text-foreground/80 hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors"
          >
            Alle tjenester
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/tjenester/${s.slug}`}
              className="bg-background hover:bg-muted/40 group flex flex-col gap-4 p-8 transition-colors md:p-10"
            >
              <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
                {s.kicker}
              </p>
              <h3 className="text-2xl font-semibold tracking-tight">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.summary}</p>
              <span className="text-foreground/70 group-hover:text-foreground mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium transition-colors">
                Les mer
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedProjects({
  projects,
}: {
  projects: Awaited<ReturnType<typeof getPublishedProjects>>
}) {
  if (projects.length === 0) return null

  return (
    <section className="border-border border-b px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
              Utvalgte prosjekter
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
              Det vi har bygget.
            </h2>
          </div>
          <Link
            href="/prosjekter"
            className="text-foreground/80 hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors"
          >
            Alle prosjekter
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Link
              key={p.id}
              href={`/prosjekter/${p.slug}`}
              className={`group block overflow-hidden rounded-2xl ${
                i === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="bg-muted relative aspect-[4/5] overflow-hidden">
                {p.cover_image_url ? (
                  <Image
                    src={p.cover_image_url}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-80">
                    {typeLabels[p.type]}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
                    {p.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReviewsGlimpse({
  reviews,
  average,
}: {
  reviews: Awaited<ReturnType<typeof getPublishedReviews>>
  average: number
}) {
  if (reviews.length === 0) return null

  return (
    <section className="border-border border-b bg-muted/30 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
              Anmeldelser
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
              Det kundene sier.
            </h2>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-foreground text-4xl font-semibold tabular-nums">
              {average.toFixed(1)}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < Math.round(average)
                      ? 'fill-foreground text-foreground h-4 w-4'
                      : 'text-muted-foreground/40 h-4 w-4'
                  }
                />
              ))}
            </div>
            <Link
              href="/anmeldelser"
              className="text-muted-foreground hover:text-foreground ml-3 text-sm transition-colors"
            >
              Se alle
            </Link>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="bg-background border-border flex flex-col gap-4 rounded-2xl border p-8"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < r.rating
                        ? 'fill-foreground text-foreground h-3.5 w-3.5'
                        : 'text-muted-foreground/30 h-3.5 w-3.5'
                    }
                  />
                ))}
              </div>
              <p className="text-foreground/90 text-base leading-relaxed">“{r.body}”</p>
              <p className="text-muted-foreground mt-auto text-xs">{r.customer_name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBanner() {
  return (
    <section className="bg-foreground text-background px-6 py-32 md:py-40">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">
            Start her
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Fortell oss om
            <br />
            ditt neste prosjekt.
          </h2>
          <p className="mt-6 max-w-xl text-base opacity-70 md:text-lg">
            Vi tar en uforpliktende befaring og blir kjent. Du får et tydelig tilbud du faktisk
            kan stole på.
          </p>
        </div>
        <Link
          href="/kontakt"
          className="bg-background text-foreground hover:bg-background/90 inline-flex shrink-0 items-center gap-2 rounded-full px-8 py-5 text-base font-medium tracking-wide transition-colors"
        >
          Få et tilbud
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

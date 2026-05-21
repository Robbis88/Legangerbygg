import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

import { getPublishedReviews, type ReviewListItem } from '@/lib/queries/reviews'

export const metadata: Metadata = {
  title: 'Anmeldelser',
  description:
    'Det kundene våre sier om Tømrer Ronny Osvaag AS — anmeldelser fra nybygg, totalrenoveringer og flipp-prosjekter i Bergen.',
}

export default async function AnmeldelserPage() {
  const reviews = await getPublishedReviews()
  const average =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  return (
    <>
      <section className="border-border border-b px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
            Anmeldelser
          </p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Det kundene sier.
          </h1>
          {reviews.length > 0 ? (
            <div className="mt-10 flex items-baseline gap-4">
              <span className="text-foreground text-5xl font-semibold tabular-nums md:text-6xl">
                {average.toFixed(1)}
              </span>
              <Stars rating={Math.round(average)} />
              <span className="text-muted-foreground text-sm">
                Basert på {reviews.length} {reviews.length === 1 ? 'anmeldelse' : 'anmeldelser'}
              </span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          {reviews.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-px overflow-hidden rounded-2xl border">
              {reviews.map((r) => (
                <ReviewRow key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-foreground text-background px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-60">
              Vil du være den neste?
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Få et uforpliktende tilbud.
            </h2>
          </div>
          <Link
            href="/kontakt"
            className="bg-background text-foreground hover:bg-background/90 inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium tracking-wide transition-colors"
          >
            Få et tilbud
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}

function ReviewRow({ review }: { review: ReviewListItem }) {
  return (
    <article className="bg-background flex flex-col gap-4 p-8 md:p-10">
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} />
        {review.project ? (
          <Link
            href={`/prosjekter/${review.project.slug}`}
            className="text-muted-foreground hover:text-foreground font-mono text-[10px] tracking-[0.3em] uppercase transition-colors"
          >
            {review.project.title} →
          </Link>
        ) : null}
      </div>
      <p className="text-foreground/90 text-base leading-relaxed md:text-lg">“{review.body}”</p>
      <p className="text-muted-foreground text-sm">{review.customer_name}</p>
    </article>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} av 5 stjerner`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < rating ? 'fill-foreground text-foreground h-4 w-4' : 'text-muted-foreground/40 h-4 w-4'
          }
        />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="border-border flex flex-col items-center gap-4 rounded-2xl border border-dashed py-24 text-center">
      <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
        Ingen anmeldelser publisert ennå
      </p>
    </div>
  )
}

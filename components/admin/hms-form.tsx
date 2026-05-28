'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import { saveHmsArticle, deleteHmsArticle, type HmsResult } from '@/lib/actions/hms'
import type { HmsArticle } from '@/lib/queries/hms'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export function HmsForm({ article }: { article?: HmsArticle | null }) {
  const [state, formAction, pending] = useActionState<HmsResult, FormData>(saveHmsArticle, null)

  return (
    <div className="space-y-6">
      <form
        action={formAction}
        className="border-border bg-background space-y-5 rounded-2xl border p-6"
      >
        {article ? <input type="hidden" name="id" value={article.id} /> : null}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="hms-title">Tittel</Label>
            <Input id="hms-title" name="title" defaultValue={article?.title ?? ''} required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hms-cat">Kategori</Label>
            <Input
              id="hms-cat"
              name="category"
              defaultValue={article?.category ?? ''}
              placeholder="f.eks. Verneutstyr, Avvik, Førstehjelp"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hms-slug">Slug</Label>
            <Input
              id="hms-slug"
              name="slug"
              defaultValue={article?.slug ?? ''}
              placeholder="genereres automatisk"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hms-sort">Sorteringsrekkefølge</Label>
            <Input
              id="hms-sort"
              name="sort_order"
              type="number"
              min="0"
              defaultValue={article?.sort_order ?? 0}
              className="w-32"
            />
          </div>

          <label className="flex items-center gap-2 text-sm" htmlFor="hms-pub">
            <input
              id="hms-pub"
              name="published"
              type="checkbox"
              defaultChecked={article?.published ?? true}
              className="size-4 accent-foreground"
            />
            Publisert
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hms-body">Innhold</Label>
          <Textarea
            id="hms-body"
            name="body"
            rows={16}
            defaultValue={article?.body ?? ''}
            placeholder="Skriv prosedyren, sjekklisten eller rutinen her. Linjeskift bevares."
          />
        </div>

        {state && !state.ok ? (
          <p className="text-destructive text-sm" role="alert">
            {state.error}
          </p>
        ) : null}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? 'Lagrer…' : article ? 'Lagre endringer' : 'Opprett artikkel'}
          </Button>
          <Link href="/admin/hms" className={cn(buttonVariants({ variant: 'ghost' }))}>
            Avbryt
          </Link>
        </div>
      </form>

      {article ? (
        <form
          action={deleteHmsArticle}
          className="border-border flex items-center justify-between rounded-2xl border border-dashed p-5"
        >
          <input type="hidden" name="id" value={article.id} />
          <div>
            <p className="text-sm font-medium">Slett artikkel</p>
            <p className="text-muted-foreground text-xs">Fjerner permanent.</p>
          </div>
          <Button type="submit" variant="destructive" size="sm">
            Slett
          </Button>
        </form>
      ) : null}
    </div>
  )
}

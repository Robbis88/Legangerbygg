'use client'

import Link from 'next/link'
import { useActionState, useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import { saveQuote, type QuoteActionResult } from '@/lib/actions/quote'
import { computeQuoteTotals, formatNok } from '@/lib/quote'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type ItemFields = { description: string; quantity: string; unit: string; unit_price: string }

export type QuoteFormInitial = {
  id?: string
  inquiry_id?: string | null
  customer_name?: string
  customer_email?: string | null
  customer_phone?: string | null
  customer_address?: string | null
  title?: string
  intro?: string | null
  notes?: string | null
  vat_rate?: number
  valid_until?: string | null
  items?: { description: string; quantity: number; unit: string | null; unit_price: number }[]
}

function emptyItem(): ItemFields {
  return { description: '', quantity: '1', unit: '', unit_price: '' }
}

export function QuoteForm({ initial }: { initial?: QuoteFormInitial }) {
  const [state, formAction, pending] = useActionState<QuoteActionResult, FormData>(saveQuote, null)

  const [items, setItems] = useState<ItemFields[]>(() => {
    const src = initial?.items
    if (!src || src.length === 0) return [emptyItem()]
    return src.map((i) => ({
      description: i.description,
      quantity: String(i.quantity),
      unit: i.unit ?? '',
      unit_price: String(i.unit_price),
    }))
  })
  const [vatRate, setVatRate] = useState<string>(String(initial?.vat_rate ?? 25))

  const numericItems = useMemo(
    () =>
      items.map((i) => ({
        description: i.description,
        quantity: Number(i.quantity) || 0,
        unit: i.unit.trim() ? i.unit : null,
        unit_price: Number(i.unit_price) || 0,
      })),
    [items],
  )
  const totals = useMemo(
    () => computeQuoteTotals(numericItems, Number(vatRate) || 0),
    [numericItems, vatRate],
  )

  function update(idx: number, key: keyof ItemFields, value: string) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)))
  }
  function addRow() {
    setItems((prev) => [...prev, emptyItem()])
  }
  function removeRow(idx: number) {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : [emptyItem()]))
  }

  return (
    <form action={formAction} className="space-y-6">
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      {initial?.inquiry_id ? (
        <input type="hidden" name="inquiry_id" value={initial.inquiry_id} />
      ) : null}
      <input type="hidden" name="items_json" value={JSON.stringify(numericItems)} />

      {/* Kunde */}
      <section className="border-border bg-background grid gap-5 rounded-2xl border p-6 md:grid-cols-2">
        <h2 className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase md:col-span-2">
          Kunde
        </h2>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-name">Navn</Label>
          <Input id="q-name" name="customer_name" defaultValue={initial?.customer_name ?? ''} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-email">E-post</Label>
          <Input id="q-email" name="customer_email" type="email" defaultValue={initial?.customer_email ?? ''} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-phone">Telefon</Label>
          <Input id="q-phone" name="customer_phone" defaultValue={initial?.customer_phone ?? ''} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-addr">Adresse</Label>
          <Input id="q-addr" name="customer_address" defaultValue={initial?.customer_address ?? ''} />
        </div>
      </section>

      {/* Tilbud */}
      <section className="border-border bg-background grid gap-5 rounded-2xl border p-6">
        <h2 className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
          Tilbud
        </h2>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-title">Tittel / prosjekt</Label>
          <Input id="q-title" name="title" defaultValue={initial?.title ?? ''} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q-intro">Innledende tekst</Label>
          <Textarea
            id="q-intro"
            name="intro"
            rows={3}
            defaultValue={initial?.intro ?? ''}
            placeholder="F.eks. «Takk for henvendelsen. Her er vårt forslag …»"
          />
        </div>
      </section>

      {/* Linjeposter */}
      <section className="border-border bg-background space-y-4 rounded-2xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
            Linjeposter
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus className="size-3.5" />
            Legg til linje
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const lineTotal = (Number(item.quantity) || 0) * (Number(item.unit_price) || 0)
            return (
              <div
                key={idx}
                className="border-border grid items-end gap-3 rounded-xl border p-4 md:grid-cols-[1fr_5rem_5rem_7rem_5.5rem_auto]"
              >
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Beskrivelse</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => update(idx, 'description', e.target.value)}
                    placeholder="Hva inngår?"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Antall</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={item.quantity}
                    onChange={(e) => update(idx, 'quantity', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Enhet</Label>
                  <Input
                    value={item.unit}
                    onChange={(e) => update(idx, 'unit', e.target.value)}
                    placeholder="stk / t / m²"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Enhetspris (kr)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={item.unit_price}
                    onChange={(e) => update(idx, 'unit_price', e.target.value)}
                  />
                </div>
                <div className="text-right text-sm font-medium tabular-nums">{formatNok(lineTotal)}</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeRow(idx)}
                  aria-label="Fjern linje"
                >
                  <Trash2 />
                </Button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Vilkår + totaler */}
      <section className="border-border bg-background grid gap-6 rounded-2xl border p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="q-vat">Mva %</Label>
              <Input
                id="q-vat"
                name="vat_rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                className="w-24"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="q-valid">Gyldig til</Label>
              <Input
                id="q-valid"
                name="valid_until"
                type="date"
                defaultValue={initial?.valid_until ?? ''}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="q-notes">Vilkår / notater</Label>
            <Textarea id="q-notes" name="notes" rows={4} defaultValue={initial?.notes ?? ''} />
          </div>
        </div>

        <div className="border-border bg-muted/30 self-start rounded-xl border p-4">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Sum eks. mva</dt>
              <dd className="tabular-nums">{formatNok(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Mva ({vatRate || 0} %)</dt>
              <dd className="tabular-nums">{formatNok(totals.vat)}</dd>
            </div>
            <div className="border-border flex justify-between border-t pt-2 text-base font-semibold">
              <dt>Totalt</dt>
              <dd className="tabular-nums">{formatNok(totals.total)}</dd>
            </div>
          </dl>
        </div>
      </section>

      {state && !state.ok ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Lagrer…' : initial?.id ? 'Lagre endringer' : 'Opprett tilbud'}
        </Button>
        <Link href="/admin/tilbud" className={cn(buttonVariants({ variant: 'ghost' }))}>
          Avbryt
        </Link>
      </div>
    </form>
  )
}

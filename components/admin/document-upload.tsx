'use client'

import { useActionState, useEffect, useRef } from 'react'

import { uploadDocument, type DocResult } from '@/lib/actions/document'
import { documentKindValues, documentKindLabels } from '@/lib/validators/document'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const selectClass =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function DocumentUpload({ projectId }: { projectId: string }) {
  const [state, formAction, pending] = useActionState<DocResult | null, FormData>(
    uploadDocument,
    null,
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok) formRef.current?.reset()
  }, [state])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="border-border bg-muted/30 grid gap-4 rounded-2xl border p-5 md:grid-cols-2"
    >
      <input type="hidden" name="project_id" value={projectId} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="doc-file">Fil (bilde eller PDF)</Label>
        <Input
          id="doc-file"
          name="file"
          type="file"
          accept="image/*,application/pdf"
          required
          className="h-auto py-1.5"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="doc-kind">Type</Label>
        <select id="doc-kind" name="kind" defaultValue="kvittering" className={selectClass}>
          {documentKindValues.map((k) => (
            <option key={k} value={k}>
              {documentKindLabels[k]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="doc-supplier">Leverandør</Label>
        <Input id="doc-supplier" name="supplier" placeholder="f.eks. Maxbo" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="doc-amount">Beløp (kr, inkl. mva)</Label>
        <Input id="doc-amount" name="amount" type="number" min="0" step="0.01" inputMode="decimal" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="doc-date">Dato</Label>
        <Input id="doc-date" name="doc_date" type="date" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="doc-note">Notat</Label>
        <Input id="doc-note" name="note" placeholder="valgfritt" />
      </div>

      <div className="flex items-center gap-3 md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Laster opp…' : 'Last opp'}
        </Button>
        {state?.ok ? (
          <span className="text-sm text-emerald-600">{state.message}</span>
        ) : state && !state.ok ? (
          <span className="text-destructive text-sm">{state.error}</span>
        ) : null}
      </div>
    </form>
  )
}

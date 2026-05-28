'use client'

import { useActionState } from 'react'
import { CheckCircle2 } from 'lucide-react'

import { signQuote, type SignActionResult } from '@/lib/actions/quote'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignQuoteForm({
  token,
  customerName,
}: {
  token: string
  customerName: string
}) {
  const [state, formAction, pending] = useActionState<SignActionResult, FormData>(signQuote, null)

  if (state?.ok) {
    return (
      <div className="border-emerald-500/30 bg-emerald-500/10 rounded-2xl border p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 text-emerald-700" />
          <div>
            <p className="font-semibold text-emerald-900">Tilbudet er godkjent.</p>
            <p className="text-emerald-900/80 mt-1 text-sm">
              Takk! Vi har fått beskjed og tar kontakt for å avtale oppstart.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      className="border-border bg-background space-y-4 rounded-2xl border p-6"
    >
      <input type="hidden" name="token" value={token} />

      <div>
        <h3 className="text-lg font-semibold tracking-tight">Godkjenn tilbudet</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Skriv fulle navn nedenfor og kryss av for å bekrefte tilbudet. Vi får beskjed med en
          gang.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sign-name">Fullt navn (din signatur)</Label>
        <Input id="sign-name" name="name" required defaultValue={customerName} />
      </div>

      <label className="flex items-start gap-2 text-sm" htmlFor="sign-accept">
        <input
          id="sign-accept"
          name="accept"
          type="checkbox"
          required
          className="mt-0.5 size-4 accent-foreground"
        />
        <span>
          Jeg bekrefter at jeg har lest tilbudet og godkjenner det som bindende avtale.
        </span>
      </label>

      {state && !state.ok ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? 'Sender…' : 'Godkjenn tilbudet'}
      </Button>
    </form>
  )
}

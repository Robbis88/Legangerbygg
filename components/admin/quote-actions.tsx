'use client'

import { useActionState } from 'react'
import { Mail } from 'lucide-react'

import { sendQuote, type SendResult } from '@/lib/actions/quote'
import { Button } from '@/components/ui/button'

export function QuoteSendForm({
  quoteId,
  hasEmail,
  alreadySent,
}: {
  quoteId: string
  hasEmail: boolean
  alreadySent: boolean
}) {
  const [state, formAction, pending] = useActionState<SendResult | null, FormData>(
    sendQuote,
    null,
  )

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="id" value={quoteId} />
      <Button type="submit" disabled={pending || !hasEmail}>
        <Mail className="size-4" />
        {pending ? 'Sender…' : alreadySent ? 'Send på nytt' : 'Send på e-post'}
      </Button>
      {!hasEmail ? (
        <span className="text-muted-foreground text-xs">Fyll inn kunde-e-post først</span>
      ) : null}
      {state?.ok ? (
        <span className="text-sm text-emerald-600">{state.message}</span>
      ) : state && !state.ok ? (
        <span className="text-destructive text-sm">{state.error}</span>
      ) : null}
    </form>
  )
}

'use client'

import { useActionState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { submitInquiry, type SubmitInquiryResult } from '@/lib/actions/kontakt'
import { projectTypeLabels, projectTypeValues } from '@/lib/validators/inquiry'
import { cn } from '@/lib/utils'

export function KontaktForm() {
  const [state, action, pending] = useActionState<SubmitInquiryResult | null, FormData>(
    submitInquiry,
    null,
  )

  if (state?.ok) {
    return <SuccessMessage />
  }

  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined

  return (
    <form action={action} className="flex flex-col gap-8" noValidate>
      {state?.ok === false && !fieldErrors ? (
        <div className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border p-4 text-sm">
          {state.error}
        </div>
      ) : null}

      <Field label="Navn" name="name" required error={fieldErrors?.name} />
      <Field label="E-post" name="email" type="email" required error={fieldErrors?.email} />

      <div className="grid gap-8 md:grid-cols-2">
        <Field label="Telefon" name="phone" type="tel" error={fieldErrors?.phone} />
        <Field label="Adresse" name="address" error={fieldErrors?.address} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <SelectField
          label="Type prosjekt"
          name="project_type"
          error={fieldErrors?.project_type}
          options={projectTypeValues.map((v) => ({ value: v, label: projectTypeLabels[v] }))}
        />
        <Field
          label="Budsjett (omtrentlig)"
          name="budget"
          placeholder="f.eks. 500 000 – 1 000 000 kr"
          error={fieldErrors?.budget}
        />
      </div>

      <TextareaField
        label="Beskriv prosjektet"
        name="description"
        required
        rows={6}
        placeholder="Hva ønsker du å bygge, pusse opp eller renovere? Tidsplan, omfang, spesielle ønsker."
        error={fieldErrors?.description}
      />

      {/* Honeypot — usynlig for ekte brukere */}
      <div
        aria-hidden
        style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}
      >
        <label>
          Ikke fyll ut dette feltet
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col items-start gap-4 pt-4 md:flex-row md:items-center md:justify-between">
        <p className="text-muted-foreground text-xs">
          Vi tar kontakt innen én virkedag.
        </p>
        <button
          type="submit"
          disabled={pending}
          className={cn(
            'bg-foreground text-background hover:bg-foreground/90 inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium tracking-wide transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          {pending ? 'Sender…' : 'Send forespørsel'}
          {pending ? null : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </form>
  )
}

type FieldProps = {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  error?: string
}

function Field({ label, name, type = 'text', required, placeholder, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="text-foreground text-sm font-medium">
        {label}
        {required ? <span className="text-muted-foreground ml-1">*</span> : null}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="h-12 rounded-lg border-input/70 bg-background text-base"
      />
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  )
}

function TextareaField({ label, name, required, rows, placeholder, error }: FieldProps & { rows?: number }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="text-foreground text-sm font-medium">
        {label}
        {required ? <span className="text-muted-foreground ml-1">*</span> : null}
      </Label>
      <Textarea
        id={name}
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="rounded-lg border-input/70 bg-background text-base"
      />
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  )
}

function SelectField({
  label,
  name,
  options,
  error,
}: {
  label: string
  name: string
  options: { value: string; label: string }[]
  error?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="text-foreground text-sm font-medium">
        {label}
      </Label>
      <select
        id={name}
        name={name}
        defaultValue=""
        aria-invalid={Boolean(error)}
        className="border-input/70 bg-background focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 h-12 w-full rounded-lg border px-3 text-base transition-colors outline-none focus-visible:ring-3"
      >
        <option value="">Velg…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  )
}

function SuccessMessage() {
  return (
    <div className="border-border flex flex-col items-start gap-6 rounded-2xl border p-10 md:p-14">
      <div className="bg-foreground text-background flex h-12 w-12 items-center justify-center rounded-full">
        <Check className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Takk for henvendelsen!</h2>
        <p className="text-muted-foreground mt-3 max-w-lg text-base leading-relaxed">
          Vi har mottatt meldingen din og tar kontakt innen én virkedag. Sjekk gjerne også
          spam-mappen, slik at svaret ikke havner der ved en feil.
        </p>
      </div>
      <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
        Kvalitet i hvert prosjekt
      </p>
    </div>
  )
}

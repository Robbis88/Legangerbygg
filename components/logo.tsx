import { cn } from '@/lib/utils'

type LogoVariant = 'mark' | 'compact' | 'stacked' | 'full'

type LogoProps = {
  variant?: LogoVariant
  className?: string
  /** Tilgjengelig navn — settes på <title> for skjermlesere */
  title?: string
}

/**
 * Troas Bygg-logo.
 *
 * Varianter:
 * - mark: kun TR-monogrammet med tak (favicon-klar, kvadratisk)
 * - compact: mark + "TROAS BYGG" inline (header)
 * - stacked: mark + "TØMRER / RONNY OSVAAG AS" stablet (footer, om-sider)
 * - full: stacked + tagline "KVALITET I HVERT PROSJEKT" (hero, splash)
 *
 * Marken bruker currentColor — sett tekstfarge på containeren for å fargelegge.
 */
export function Logo({ variant = 'compact', className, title }: LogoProps) {
  const a11yTitle = title ?? 'Troas Bygg — Tømrer Ronny Osvaag AS'

  if (variant === 'mark') {
    return <Logomark className={className} title={a11yTitle} />
  }

  if (variant === 'compact') {
    return (
      <span
        className={cn('inline-flex items-center gap-3 text-foreground', className)}
        aria-label={a11yTitle}
      >
        <Logomark className="h-8 w-8 shrink-0" decorative />
        <span className="text-base font-semibold tracking-[0.2em] uppercase">Troas Bygg</span>
      </span>
    )
  }

  // 'stacked' og 'full' deler oppbygning
  return (
    <span
      className={cn('inline-flex flex-col items-center gap-4 text-foreground', className)}
      aria-label={a11yTitle}
    >
      <Logomark className="h-16 w-auto" decorative />
      <span className="flex flex-col items-center leading-none">
        <span className="text-xs font-medium tracking-[0.4em] uppercase">Tømrer</span>
        <span className="mt-2 text-2xl font-semibold tracking-[0.08em] uppercase md:text-3xl">
          Ronny Osvaag AS
        </span>
        {variant === 'full' ? (
          <span className="text-muted-foreground mt-4 flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase">
            <span className="bg-current h-px w-12 opacity-40" aria-hidden />
            Kvalitet i hvert prosjekt
            <span className="bg-current h-px w-12 opacity-40" aria-hidden />
          </span>
        ) : null}
      </span>
    </span>
  )
}

type LogomarkProps = {
  className?: string
  title?: string
  /** Når sant, marken er rent dekorativ og skjules for skjermlesere */
  decorative?: boolean
}

/**
 * Marken alene — TR-monogram med hustak og pipe. Tegnet fra det offisielle
 * Troas Bygg-logo-designet. Bruker currentColor for å arve farge fra
 * containeren. ViewBox 360x240 (3:2-aspekt).
 */
export function Logomark({ className, title, decorative = false }: LogomarkProps) {
  return (
    <svg
      viewBox="360 110 360 240"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={18}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorative ? 'true' : undefined}
      role={decorative ? undefined : 'img'}
      className={cn('text-current', className)}
    >
      {!decorative && title ? <title>{title}</title> : null}
      {/* T — topp og stamme */}
      <path d="M370 120 L560 120" />
      <path d="M465 120 L465 260" />
      {/* R — stamme, bue og diagonal */}
      <path d="M560 120 L560 280" />
      <path d="M560 120 Q700 120 700 190 Q700 250 620 250" />
      <path d="M620 250 L710 340" />
      {/* Tak — chevron over monogrammet */}
      <path d="M410 320 L535 220 L660 320" />
      {/* Pipe med vindu-detalj */}
      <rect x="515" y="300" width="40" height="40" />
      <line x1="535" y1="300" x2="535" y2="340" />
      <line x1="515" y1="320" x2="555" y2="320" />
    </svg>
  )
}

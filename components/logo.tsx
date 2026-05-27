import { cn } from '@/lib/utils'

type LogoVariant = 'mark' | 'compact' | 'stacked' | 'full'

type LogoProps = {
  variant?: LogoVariant
  className?: string
  /** Tilgjengelig navn — settes på <title> for skjermlesere */
  title?: string
}

/** Merkefarger fra logo-designet. */
const BRAND_GREEN = '#2C3E2D'
const BRAND_OCHRE = '#C9842B'

/** Serif-wordmarken — matcher teksten i logo-SVG-en. */
const WORDMARK_FONT = 'Georgia, "Times New Roman", serif'

/**
 * Leganger Bygg AS-logo.
 *
 * Varianter:
 * - mark: kun hus-/L-merket (favicon-klar, kvadratisk)
 * - compact: mark + "LEGANGER BYGG AS" inline (header)
 * - stacked: mark over wordmark (footer, om-sider)
 * - full: stacked + tagline "KVALITET I HVERT PROSJEKT" (hero, splash)
 *
 * Monogrammet har faste merkefarger — overstyr via <Logomark primary/accent>
 * for f.eks. et hvitt merke på mørk bakgrunn.
 */
export function Logo({ variant = 'compact', className, title }: LogoProps) {
  const a11yTitle = title ?? 'Leganger Bygg AS'

  if (variant === 'mark') {
    return <Logomark className={className} title={a11yTitle} />
  }

  if (variant === 'compact') {
    return (
      <span
        className={cn('inline-flex items-center gap-3', className)}
        aria-label={a11yTitle}
      >
        <Logomark className="h-9 w-9 shrink-0" decorative />
        <span
          className="text-base font-bold tracking-[0.18em] uppercase"
          style={{ fontFamily: WORDMARK_FONT, color: BRAND_GREEN }}
        >
          Leganger Bygg AS
        </span>
      </span>
    )
  }

  // 'stacked' og 'full' deler oppbygning
  return (
    <span
      className={cn('inline-flex flex-col items-center gap-4', className)}
      aria-label={a11yTitle}
    >
      <Logomark className="h-16 w-16" decorative />
      <span
        className="text-xl font-bold tracking-[0.2em] uppercase md:text-2xl"
        style={{ fontFamily: WORDMARK_FONT, color: BRAND_GREEN }}
      >
        Leganger Bygg AS
      </span>
      {variant === 'full' ? (
        <span className="text-muted-foreground mt-2 flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase">
          <span className="bg-current h-px w-12 opacity-40" aria-hidden />
          Kvalitet i hvert prosjekt
          <span className="bg-current h-px w-12 opacity-40" aria-hidden />
        </span>
      ) : null}
    </span>
  )
}

type LogomarkProps = {
  className?: string
  title?: string
  /** Når sant, marken er rent dekorativ og skjules for skjermlesere */
  decorative?: boolean
  /** L- og B-strøkene (standard: merkegrønn) */
  primary?: string
  /** Takstrøket (standard: oker) */
  accent?: string
}

/**
 * Marken alene — et hus/gavl der venstre vegg og gulv danner en L, kronet
 * av en taklinje i oker. Kvadratisk viewBox, favicon-klar.
 */
export function Logomark({
  className,
  title,
  decorative = false,
  primary = BRAND_GREEN,
  accent = BRAND_OCHRE,
}: LogomarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorative ? 'true' : undefined}
      role={decorative ? undefined : 'img'}
      className={cn(className)}
    >
      {!decorative && title ? <title>{title}</title> : null}
      {/* Tak (gavl) i oker */}
      <path d="M 18 38 L 50 14 L 82 38" stroke={accent} />
      {/* L — venstre vegg og gulv */}
      <path d="M 32 30 L 32 80 L 74 80" stroke={primary} />
    </svg>
  )
}

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
 * - mark: kun L+tak+B-monogrammet (favicon-klar, kvadratisk)
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
 * Marken alene — L + hustak + B-monogram. Tegnet fra det offisielle
 * Leganger Bygg AS-logo-designet. Kvadratisk viewBox sentrert om merket.
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
      viewBox="50 10 120 120"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      strokeWidth={6}
      aria-hidden={decorative ? 'true' : undefined}
      role={decorative ? undefined : 'img'}
      className={cn(className)}
    >
      {!decorative && title ? <title>{title}</title> : null}
      <g transform="translate(60, 30)">
        {/* L */}
        <path d="M 10 10 L 10 80 L 50 80" stroke={primary} strokeLinecap="square" />
        {/* Hustak over */}
        <path
          d="M 0 25 L 35 0 L 70 25"
          stroke={accent}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* B integrert */}
        <path
          d="M 60 10 L 60 80 L 85 80 Q 100 80 100 65 Q 100 50 85 50 L 60 50 M 85 50 Q 98 50 98 35 Q 98 20 85 20 L 60 20"
          stroke={primary}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </g>
    </svg>
  )
}

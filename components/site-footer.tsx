import Link from 'next/link'

import { Logo } from '@/components/logo'
import { primaryNav } from '@/lib/nav'

export function SiteFooter() {
  // Hardkodet — Cache Components tillater ikke `new Date()` ved prerender.
  // Vi oppdaterer manuelt per år, eller bytter til en `use cache`-komponent senere.
  const year = 2026

  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-16 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12">
          <div>
            <Logo variant="stacked" className="items-start text-left" />
            <p className="text-muted-foreground mt-6 max-w-sm text-sm leading-relaxed">
              Tømrermester med fokus på kvalitet, presisjon og prosjektledelse. Nybygg,
              totalrenovering, rehabilitering og oppussing.
            </p>
          </div>

          <div>
            <h3 className="text-muted-foreground mb-4 font-mono text-xs tracking-[0.25em] uppercase">
              Sider
            </h3>
            <ul className="space-y-3">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-muted-foreground mb-4 font-mono text-xs tracking-[0.25em] uppercase">
              Kontakt
            </h3>
            <ul className="text-foreground/80 space-y-2 text-sm">
              <li>
                Lasse Leganger
                <span className="text-muted-foreground block text-xs">Daglig leder</span>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="tel:+4748866516">
                  488 66 516
                </a>
              </li>
              <li>
                <a
                  className="hover:text-foreground transition-colors"
                  href="mailto:post@legangerbygg.no"
                >
                  post@legangerbygg.no
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border mt-16 flex flex-col gap-3 border-t pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-muted-foreground text-xs">
            © {year} Leganger Bygg AS. Alle rettigheter reservert.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-muted-foreground hover:text-foreground font-mono text-[10px] tracking-[0.3em] uppercase transition-colors"
            >
              Logg inn
            </Link>
            <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
              Kvalitet i hvert prosjekt
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

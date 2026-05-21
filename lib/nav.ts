/**
 * Primær-navigasjon for offentlige sider.
 * Holdes som en enkel liste slik at header og mobil-meny deler samme kilde.
 */
export type NavItem = {
  label: string
  href: string
}

export const primaryNav: NavItem[] = [
  { label: 'Tjenester', href: '/tjenester' },
  { label: 'Prosjekter', href: '/prosjekter' },
  { label: 'Om oss', href: '/om-oss' },
  { label: 'Anmeldelser', href: '/anmeldelser' },
  { label: 'Kontakt', href: '/kontakt' },
]

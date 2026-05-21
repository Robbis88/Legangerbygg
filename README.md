# Troas Bygg

Premium webplattform og driftssystem for **Tømrer Ronny Osvaag AS** i Bergen.

**Domene:** [troasbygg.no](https://troasbygg.no)

## Hva dette er

Tre lag som deler én kodebase:

1. **Offentlig nettside** — selger inn firmaet, genererer kundeforespørsler.
2. **Internt driftssystem** (under utvikling) — CRM, tilbud, prosjekter, timer, flipp-økonomi.
3. **Kundeportal** (senere) — kunder følger sitt prosjekt med bilder og fremdrift.

## Stack

- **Framework:** Next.js 16 (App Router, Cache Components / PPR)
- **Språk:** TypeScript strict
- **Styling:** Tailwind v4 + shadcn/ui
- **Database:** Supabase (Postgres + RLS)
- **Auth:** Supabase Auth
- **Filer/bilder:** Supabase Storage
- **E-post:** Resend
- **AI:** Anthropic SDK (Fase 4)
- **Hosting:** Vercel

## Kom i gang

```bash
npm install
cp .env.local.example .env.local
# Fyll inn Supabase + Resend-verdier i .env.local
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Mappestruktur

```
app/                        Next.js App Router
  (public)/                 Offentlige sider med felles header/footer
    page.tsx                Forside
    om-oss/                 Om firmaet
    tjenester/              9 tjenester (statisk innhold)
    prosjekter/             DB-drevet med filter
    anmeldelser/            DB-drevet
    kontakt/                Skjema med Server Action + Resend
  icon.svg                  Favicon (TR-mark)
  opengraph-image.tsx       Dynamisk OG-image
  sitemap.ts, robots.ts     SEO
components/                 UI-komponenter
  ui/                       shadcn-primitiver
  logo.tsx                  TR-monogram + wordmark
  site-header.tsx           Sticky header
  site-footer.tsx
  kontakt-form.tsx          Skjema-klient
lib/
  supabase/                 server, client, admin, public-klienter
  queries/                  use cache-merkede DB-spørringer
  actions/                  Server Actions
  validators/               Zod-skjemaer
  email/                    Resend-templates
  services.ts               Statisk tjeneste-data
  structured-data.ts        JSON-LD-byggere
types/
  supabase.ts               DB-typer (generert format)
supabase/
  migrations/               SQL-migreringer
  README.md
```

## Database

Skjema og RLS-policies ligger i `supabase/migrations/`. Se `supabase/README.md`
for hvordan migreringer kjøres.

## Deploy

Se [DEPLOY.md](./DEPLOY.md).

## Konvensjoner

- Norsk bokmål i UI, kommentarer og commits.
- Server Components default. `'use client'` kun når nødvendig.
- Server Actions for mutasjoner — ikke API routes.
- RLS håndhever rolletilgang. Service-role-key brukes kun i Server Actions.

## Lisens

Privat — © Tømrer Ronny Osvaag AS.

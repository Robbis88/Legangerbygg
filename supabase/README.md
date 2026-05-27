# Supabase

Database-skjema og migreringer for Leganger Bygg AS.

## Migreringer

Filer i `migrations/` følger Supabase CLI-konvensjon: `YYYYMMDDHHmmss_navn.sql`.
De skal være idempotente der det er mulig (`if not exists`, `or replace`) slik at
det er trygt å kjøre dem flere ganger lokalt.

## Anvend migrering

### Via Supabase CLI (anbefalt)

```bash
npx supabase link --project-ref dwdllwrinqdobywdhzgm
npx supabase db push
```

### Manuelt via dashboard

1. Åpne https://supabase.com/dashboard/project/dwdllwrinqdobywdhzgm/sql/new
2. Lim inn innholdet i migrasjonsfilen
3. Kjør

## Regenerer TypeScript-typer

Etter at skjemaet er endret:

```bash
npx supabase gen types typescript --project-id dwdllwrinqdobywdhzgm > types/supabase.ts
```

## Rolle-modell

Tabellen `profiles` har et `role`-felt med fire verdier:

- `eier` — full tilgang (Ronny, Robert)
- `ansatt` — egne timer, prosjektvisning, ingen økonomi
- `regnskap` — alle timer og økonomi, ingen redigering av kunder
- `visning` — read-only på alt

RLS-policies håndhever dette på databasenivå via `auth.uid()` og oppslag i `profiles`.

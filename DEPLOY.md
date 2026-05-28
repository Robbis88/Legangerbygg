# Deploy

## Førstegangs-deploy til Vercel

### 1. GitHub

Repoet er knyttet til GitHub. Hver `git push` til `main` trigger
auto-deploy til produksjon på Vercel.

### 2. Vercel-prosjekt

1. Logg inn på https://vercel.com med GitHub-kontoen.
2. Klikk **Add New → Project**.
3. Importer `Robbis88/Troasbygg`.
4. **Framework Preset:** Next.js (auto-detektert).
5. **Build/output:** la stå på default.
6. **Environment Variables** — legg inn (Production + Preview + Development):

| Variabel | Hentes fra |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API (sensitive!) |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `RESEND_FROM_EMAIL` | f.eks. `onboarding@resend.dev` (test) eller `post@legangerbygg.no` (etter verifisering) |
| `RESEND_TO_INQUIRY` | Hvor henvendelser skal varsles (f.eks. `robert@kelsarbil.no`) |
| `ANTHROPIC_API_KEY` | (Fase 4 — kan stå tom inntil videre) |

7. Klikk **Deploy**.

### 3. Domene

1. På Vercel-prosjektet: **Settings → Domains**.
2. Legg til `legangerbygg.no` og `www.legangerbygg.no`.
3. Vercel viser DNS-records (`A`-record for apex og `CNAME` for `www`).
4. Konfigurer hos domeneregistraren (Domeneshop, GoDaddy, etc).
5. Vent på DNS-propagering (5–60 min). SSL settes automatisk.

### 4. Supabase Site URL

For at e-postlenker og auth-callbacks skal peke til riktig domene:

1. Supabase Dashboard → Authentication → URL Configuration.
2. Sett **Site URL** til `https://legangerbygg.no`.
3. Legg til `https://*.vercel.app` i **Redirect URLs** for preview-deployments.

### 5. Resend-domeneverifisering

Når legangerbygg.no er live på Vercel:

1. Resend Dashboard → Domains → Add Domain → `legangerbygg.no`.
2. Legg til DNS-records (SPF, DKIM) hos domeneregistraren.
3. Etter verifisering kan du sette `RESEND_FROM_EMAIL` til
   `post@legangerbygg.no` (eller hva du vil) og redeploye.

## Neste deploy

Etter førstegangsoppsettet:

```bash
git push origin main
```

Vercel deployer automatisk til produksjon. Preview-deploy lages for hver pull request.

## Manuelle commands

- Promotér en preview til produksjon: Vercel Dashboard → Deployments → klikk deploy → Promote
- Rollback: Dashboard → Deployments → klikk eldre deploy → Promote to Production
- Logs: Dashboard → Deployments → klikk → Functions → Logs

-- Fase 6: prosjektlogg (bilder/notater fra felt) + tilbudssignering.
-- ASCII-only kommentarer. Idempotent.

-- =====================================================================
-- project_log: tidslinje per prosjekt (en oppforing per dag eller mer)
-- =====================================================================

create table if not exists public.project_log (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text,
  entry_date date not null default current_date,
  body text not null default '',
  photo_paths text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists project_log_project_idx
  on public.project_log (project_id, entry_date desc, created_at desc);

drop trigger if exists set_updated_at on public.project_log;
create trigger set_updated_at
  before update on public.project_log
  for each row execute function public.set_updated_at();

alter table public.project_log enable row level security;

drop policy if exists "project_log_select_admin" on public.project_log;
create policy "project_log_select_admin"
  on public.project_log for select to authenticated using (public.has_admin_access());

drop policy if exists "project_log_write_staff" on public.project_log;
create policy "project_log_write_staff"
  on public.project_log for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- =====================================================================
-- Tilbudssignering: token-basert offentlig URL + signaturfelt paa quotes
-- =====================================================================

alter table public.quotes
  add column if not exists public_token text,
  add column if not exists signed_at timestamptz,
  add column if not exists signed_name text,
  add column if not exists signed_ip text;

-- Unik constraint kan ikke wrappes i if not exists, men en unique index er trygg.
create unique index if not exists quotes_public_token_uniq
  on public.quotes (public_token)
  where public_token is not null;

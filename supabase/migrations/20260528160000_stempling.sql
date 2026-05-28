-- Fase 7-tillegg: stempling (clock-in/out) for ansatte.
-- ASCII-only kommentarer. Idempotent.
--
-- Modell: en "aktiv stempling" leves i active_punches (en pr ansatt om gangen).
-- Ved stempel ut konverteres den til en vanlig time_entries-rad med beregnede
-- timer. Eksisterende manuell timeforing fungerer uendret.

create table if not exists public.active_punches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  started_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.active_punches enable row level security;

-- Hver bruker styrer sin egen stempling.
drop policy if exists "active_punches_own" on public.active_punches;
create policy "active_punches_own"
  on public.active_punches for all
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

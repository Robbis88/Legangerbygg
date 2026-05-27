-- Fase 2: timeforing per ansatt/prosjekt + lonnskost-innstillinger.
-- ASCII-only kommentarer med vilje (unngaa aeoeaa-mojibake ved innliming).
-- Idempotent: trygt aa kjore flere ganger.

-- =====================================================================
-- payroll_settings: enkelt-rad med satser for arbeidsgiveravgift,
-- feriepenger og pensjon (OTP). Brukes til aa beregne reell arbeidskost.
-- =====================================================================

create table if not exists public.payroll_settings (
  id int primary key default 1 check (id = 1),
  employer_tax_pct numeric(5, 2) not null default 14.10,
  holiday_pay_pct numeric(5, 2) not null default 12.00,
  pension_pct numeric(5, 2) not null default 2.00,
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.payroll_settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists set_updated_at on public.payroll_settings;
create trigger set_updated_at
  before update on public.payroll_settings
  for each row execute function public.set_updated_at();

-- =====================================================================
-- time_entries: timer fort per ansatt paa et prosjekt en gitt dag.
-- =====================================================================

create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  work_date date not null,
  hours numeric(6, 2) not null check (hours > 0 and hours <= 24),
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists time_entries_project_idx
  on public.time_entries (project_id, work_date desc);
create index if not exists time_entries_profile_idx
  on public.time_entries (profile_id, work_date desc);

drop trigger if exists set_updated_at on public.time_entries;
create trigger set_updated_at
  before update on public.time_entries
  for each row execute function public.set_updated_at();

-- =====================================================================
-- RLS
-- =====================================================================

alter table public.payroll_settings enable row level security;
alter table public.time_entries enable row level security;

-- payroll_settings: alle med admin-tilgang kan lese; staff kan endre.
drop policy if exists "payroll_select_admin" on public.payroll_settings;
create policy "payroll_select_admin"
  on public.payroll_settings for select
  to authenticated
  using (public.has_admin_access());

drop policy if exists "payroll_update_staff" on public.payroll_settings;
create policy "payroll_update_staff"
  on public.payroll_settings for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- time_entries: admin-tilgang leser; staff skriver.
drop policy if exists "time_entries_select_admin" on public.time_entries;
create policy "time_entries_select_admin"
  on public.time_entries for select
  to authenticated
  using (public.has_admin_access());

drop policy if exists "time_entries_write_staff" on public.time_entries;
create policy "time_entries_write_staff"
  on public.time_entries for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Profilfelter for "Hvem er vi"-presentasjon paa om-oss.
-- ASCII-only kommentarer. Idempotent.

alter table public.profiles
  add column if not exists title text,
  add column if not exists avatar_path text,
  add column if not exists bio text,
  add column if not exists show_on_about boolean not null default false,
  add column if not exists sort_order int not null default 0;

create index if not exists profiles_about_idx
  on public.profiles (show_on_about, sort_order, full_name)
  where show_on_about = true;

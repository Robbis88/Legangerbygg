-- MVP-skjema for offentlig nettside (Fase 1).
-- Inneholder: enums, profiles, projects, project_images, reviews, inquiries,
-- felles updated_at-trigger, og hjelpefunksjoner for RLS.
--
-- Skrevet for å være idempotent: trygt å kjøre flere ganger.

-- =====================================================================
-- 1. Enums
-- =====================================================================

do $$ begin
  create type public.user_role as enum ('eier', 'ansatt', 'regnskap', 'visning');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.project_type as enum (
    'nybygg',
    'rehabilitering',
    'totalrenovering',
    'flipp',
    'moske',
    'leilighet',
    'rekkehus',
    'prosjektledelse',
    'innvendig',
    'utvendig',
    'annet'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.project_status as enum ('planlegging', 'pagaende', 'pa_vent', 'ferdig');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.inquiry_status as enum ('ny', 'behandlet');
exception when duplicate_object then null;
end $$;

-- =====================================================================
-- 2. Felles updated_at-trigger-funksjon
-- =====================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

-- =====================================================================
-- 3. Tabeller
-- =====================================================================

-- profiles: knyttet 1:1 til auth.users via id.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role,
  active boolean not null default true,
  hourly_cost numeric(10, 2),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- projects: hovedtabell for prosjekter.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  type public.project_type not null,
  status public.project_status not null default 'planlegging',
  address text,
  description text,
  start_date date,
  end_date date,
  estimated_hours numeric(10, 2),
  is_public boolean not null default false,
  cover_image_url text,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_public_published_idx
  on public.projects (is_public, published_at desc)
  where is_public = true;
create index if not exists projects_type_idx on public.projects (type);

drop trigger if exists set_updated_at on public.projects;
create trigger set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- project_images: gallerier per prosjekt.
create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  caption text,
  sort_order integer not null default 0,
  is_before boolean not null default false,
  is_after boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists project_images_project_idx
  on public.project_images (project_id, sort_order);

-- reviews: kundeanmeldelser.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_image_url text,
  rating smallint not null check (rating between 1 and 5),
  body text not null,
  project_id uuid references public.projects(id) on delete set null,
  published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists reviews_published_idx
  on public.reviews (published, created_at desc)
  where published = true;

-- inquiries: kontaktskjema-innsendinger.
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  address text,
  project_type public.project_type,
  budget text,
  description text not null,
  image_urls text[] not null default '{}',
  status public.inquiry_status not null default 'ny',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists inquiries_status_created_idx
  on public.inquiries (status, created_at desc);

-- =====================================================================
-- 4. RLS-hjelpefunksjoner (opprettes ETTER profiles slik at referansen
-- til public.profiles validerer ved CREATE FUNCTION-tidspunkt)
-- =====================================================================

-- Sjekker om innlogget bruker har skrive-tilgang (eier eller ansatt).
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and active = true
      and role in ('eier', 'ansatt')
  );
$$;

-- Sjekker om innlogget bruker har en aktiv intern-rolle (alle fire).
create or replace function public.has_admin_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and active = true
  );
$$;

-- =====================================================================
-- 5. Auto-opprett profile når en auth.users-rad opprettes
-- =====================================================================

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Fase 5: HMS-haandbok. ASCII-only kommentarer. Idempotent.

create table if not exists public.hms_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  category text,
  body text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists hms_articles_category_idx
  on public.hms_articles (category, sort_order, title);

drop trigger if exists set_updated_at on public.hms_articles;
create trigger set_updated_at
  before update on public.hms_articles
  for each row execute function public.set_updated_at();

alter table public.hms_articles enable row level security;

drop policy if exists "hms_select_admin" on public.hms_articles;
create policy "hms_select_admin"
  on public.hms_articles for select to authenticated using (public.has_admin_access());

drop policy if exists "hms_write_staff" on public.hms_articles;
create policy "hms_write_staff"
  on public.hms_articles for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

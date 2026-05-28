-- Fase 4: tilbud (quotes) med linjeposter.
-- ASCII-only kommentarer. Idempotent.

do $$ begin
  create type public.quote_status as enum ('utkast', 'sendt', 'akseptert', 'avslaatt');
exception when duplicate_object then null;
end $$;

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text unique,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  customer_address text,
  title text not null,
  intro text,
  notes text,
  status public.quote_status not null default 'utkast',
  vat_rate numeric(5, 2) not null default 25.00,
  valid_until date,
  sent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists quotes_status_idx on public.quotes (status, created_at desc);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  description text not null,
  quantity numeric(12, 2) not null default 1,
  unit text,
  unit_price numeric(12, 2) not null default 0,
  sort_order int not null default 0
);

create index if not exists quote_items_quote_idx on public.quote_items (quote_id, sort_order);

drop trigger if exists set_updated_at on public.quotes;
create trigger set_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

-- RLS
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;

drop policy if exists "quotes_select_admin" on public.quotes;
create policy "quotes_select_admin"
  on public.quotes for select to authenticated using (public.has_admin_access());
drop policy if exists "quotes_write_staff" on public.quotes;
create policy "quotes_write_staff"
  on public.quotes for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "quote_items_select_admin" on public.quote_items;
create policy "quote_items_select_admin"
  on public.quote_items for select to authenticated using (public.has_admin_access());
drop policy if exists "quote_items_write_staff" on public.quote_items;
create policy "quote_items_write_staff"
  on public.quote_items for all to authenticated using (public.is_staff()) with check (public.is_staff());

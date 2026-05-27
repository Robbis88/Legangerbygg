-- Fase 3: kvitteringer og faktura per prosjekt.
-- ASCII-only kommentarer. Idempotent.
-- Filene lagres i Storage-botta 'prosjektdok' (privat); tilgang gaar via
-- server actions med service-role + signerte URLer.

do $$ begin
  create type public.document_kind as enum ('kvittering', 'faktura', 'annet');
exception when duplicate_object then null;
end $$;

create table if not exists public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  kind public.document_kind not null default 'kvittering',
  supplier text,
  amount numeric(12, 2),
  doc_date date,
  note text,
  storage_path text not null,
  file_name text,
  mime_type text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists project_documents_project_idx
  on public.project_documents (project_id, doc_date desc);

drop trigger if exists set_updated_at on public.project_documents;
create trigger set_updated_at
  before update on public.project_documents
  for each row execute function public.set_updated_at();

alter table public.project_documents enable row level security;

drop policy if exists "project_documents_select_admin" on public.project_documents;
create policy "project_documents_select_admin"
  on public.project_documents for select
  to authenticated
  using (public.has_admin_access());

drop policy if exists "project_documents_write_staff" on public.project_documents;
create policy "project_documents_write_staff"
  on public.project_documents for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

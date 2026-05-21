-- RLS-policies for MVP-tabeller.
--
-- Generelt prinsipp:
--   * Anon kan lese publisert innhold (projects, project_images, reviews
--     der is_public/published = true).
--   * Anon kan opprette inquiries (kontaktskjema). Rate-limiting håndteres
--     på applikasjonsnivå i Server Action.
--   * Staff (eier/ansatt) kan skrive på alt under public-domenet.
--   * Service role bypasser RLS automatisk (brukes til system-operasjoner
--     i Server Actions).

-- =====================================================================
-- Aktiver RLS
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.reviews enable row level security;
alter table public.inquiries enable row level security;

-- =====================================================================
-- profiles
-- =====================================================================

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.has_admin_access());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "profiles_update_staff" on public.profiles;
create policy "profiles_update_staff"
  on public.profiles for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Ingen INSERT/DELETE-policy: trigger på auth.users sørger for opprettelse
-- (kjøres som security definer), og sletting går via cascade fra auth.users.

-- =====================================================================
-- projects
-- =====================================================================

drop policy if exists "projects_select_public" on public.projects;
create policy "projects_select_public"
  on public.projects for select
  to anon, authenticated
  using (is_public = true and published_at is not null);

drop policy if exists "projects_select_admin" on public.projects;
create policy "projects_select_admin"
  on public.projects for select
  to authenticated
  using (public.has_admin_access());

drop policy if exists "projects_write_staff" on public.projects;
create policy "projects_write_staff"
  on public.projects for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- =====================================================================
-- project_images
-- =====================================================================

drop policy if exists "project_images_select_public" on public.project_images;
create policy "project_images_select_public"
  on public.project_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.is_public = true
        and p.published_at is not null
    )
  );

drop policy if exists "project_images_select_admin" on public.project_images;
create policy "project_images_select_admin"
  on public.project_images for select
  to authenticated
  using (public.has_admin_access());

drop policy if exists "project_images_write_staff" on public.project_images;
create policy "project_images_write_staff"
  on public.project_images for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- =====================================================================
-- reviews
-- =====================================================================

drop policy if exists "reviews_select_published" on public.reviews;
create policy "reviews_select_published"
  on public.reviews for select
  to anon, authenticated
  using (published = true);

drop policy if exists "reviews_select_admin" on public.reviews;
create policy "reviews_select_admin"
  on public.reviews for select
  to authenticated
  using (public.has_admin_access());

drop policy if exists "reviews_write_staff" on public.reviews;
create policy "reviews_write_staff"
  on public.reviews for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- =====================================================================
-- inquiries
-- =====================================================================

-- Anon kan opprette via kontaktskjema. Rate-limiting i Server Action.
drop policy if exists "inquiries_insert_anon" on public.inquiries;
create policy "inquiries_insert_anon"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "inquiries_select_admin" on public.inquiries;
create policy "inquiries_select_admin"
  on public.inquiries for select
  to authenticated
  using (public.has_admin_access());

drop policy if exists "inquiries_update_staff" on public.inquiries;
create policy "inquiries_update_staff"
  on public.inquiries for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "inquiries_delete_staff" on public.inquiries;
create policy "inquiries_delete_staff"
  on public.inquiries for delete
  to authenticated
  using (public.is_staff());

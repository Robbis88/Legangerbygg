-- Seed-data for demo. Skal være idempotent (on conflict do nothing der mulig).
-- Slettes/erstattes når Lasse har flere ekte prosjekter og anmeldelser.
-- Bildene er fra Unsplash (frie å bruke) som plassholdere.
--
-- MERK: Ikke lim denne inn i SQL-editoren via `clip.exe` — det har tidligere
-- ødelagt æøå (UTF-8 tolket som DOS-kodeside). Bruk heller
-- `node scripts/reseed-content.mjs`, som skriver rent over HTTP.

-- =====================================================================
-- Prosjekter
-- =====================================================================

insert into public.projects (slug, title, type, status, address, description, start_date, end_date, is_public, cover_image_url, published_at)
values
  (
    'leilighet-mohlenpris',
    'Leilighet på Møhlenpris',
    'leilighet',
    'ferdig',
    'Møhlenpris, Bergen',
    'Total oppussing av en toroms fra 1909. Nytt kjøkken, oppgradert bad (utført med sertifisert rørlegger og flislegger), nye eikegulv, listverk og full overflatebehandling. Ferdig på sju uker.',
    '2025-02-03',
    '2025-03-24',
    true,
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',
    '2025-04-01T10:00:00Z'
  ),
  (
    'totalrenovering-sandviken',
    'Totalrenovering i Sandviken',
    'totalrenovering',
    'ferdig',
    'Sandviken, Bergen',
    'Et eldre trehus i Sandviken ble strippet ned til bærende konstruksjon og bygget opp igjen: ny planløsning, etterisolering, nytt kjøkken og bad. Det originale preget er bevart der det lot seg gjøre.',
    '2024-09-02',
    '2025-03-14',
    true,
    'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600&q=80',
    '2025-04-10T10:00:00Z'
  ),
  (
    'flipp-laksevag',
    'Flipp på Laksevåg',
    'flipp',
    'ferdig',
    'Laksevåg, Bergen',
    'Treroms kjøpt for oppussing og videresalg. Stue og kjøkken ble åpnet opp, nytt bad (med sertifisert rørlegger og flislegger), og nye overflater gjennomgående. Solgt over takst kort tid etter visning.',
    '2025-01-13',
    '2025-03-21',
    true,
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',
    '2025-04-15T10:00:00Z'
  ),
  (
    'enebolig-fana',
    'Enebolig i Fana',
    'rehabilitering',
    'ferdig',
    'Fana, Bergen',
    'Oppussing av en enebolig fra 70-tallet mens familien bodde der: nytt kjøkken, to oppgraderte bad, nye gulv og maling gjennomgående, samt ny terrasse. Fremdriften ble lagt opp slik at hverdagen fungerte underveis.',
    '2024-05-06',
    '2024-09-27',
    true,
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
    '2024-10-15T10:00:00Z'
  ),
  (
    'rekkehus-landas',
    'Rekkehus på Landås',
    'rekkehus',
    'pagaende',
    'Landås, Bergen',
    'Pågående oppussing av et rekkehus fra 80-tallet. Nytt kjøkken, oppfrisket bad, nye gulv og overflater gjennomgående — med hensyn til lydskille mot naboene. Forventet ferdig høsten 2026.',
    '2026-03-02',
    null,
    true,
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&q=80',
    '2026-03-15T10:00:00Z'
  )
on conflict (slug) do nothing;

-- =====================================================================
-- Prosjektbilder
-- =====================================================================

do $$
begin
  -- Leilighet på Møhlenpris
  insert into public.project_images (project_id, url, sort_order)
  select id, url, ord from public.projects, unnest(
    array[
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80',
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1600&q=80'
    ]
  ) with ordinality as t(url, ord)
  where slug = 'leilighet-mohlenpris'
  on conflict do nothing;

  -- Totalrenovering i Sandviken
  insert into public.project_images (project_id, url, sort_order)
  select id, url, ord from public.projects, unnest(
    array[
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80'
    ]
  ) with ordinality as t(url, ord)
  where slug = 'totalrenovering-sandviken'
  on conflict do nothing;

  -- Flipp på Laksevåg — har før/etter
  insert into public.project_images (project_id, url, sort_order, is_before, is_after)
  values
    ((select id from public.projects where slug = 'flipp-laksevag'),
     'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=1600&q=80', 1, true, false),
    ((select id from public.projects where slug = 'flipp-laksevag'),
     'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80', 2, false, true),
    ((select id from public.projects where slug = 'flipp-laksevag'),
     'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1600&q=80', 3, false, true)
  on conflict do nothing;

  -- Enebolig i Fana
  insert into public.project_images (project_id, url, sort_order)
  select id, url, ord from public.projects, unnest(
    array[
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80'
    ]
  ) with ordinality as t(url, ord)
  where slug = 'enebolig-fana'
  on conflict do nothing;

  -- Rekkehus på Landås — pågående
  insert into public.project_images (project_id, url, sort_order)
  select id, url, ord from public.projects, unnest(
    array[
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80'
    ]
  ) with ordinality as t(url, ord)
  where slug = 'rekkehus-landas'
  on conflict do nothing;
end $$;

-- =====================================================================
-- Anmeldelser
-- =====================================================================

insert into public.reviews (customer_name, rating, body, project_id, published)
values
  (
    'Eirik H., Møhlenpris',
    5,
    'Lasse pusset opp leiligheten vår fra A til Å. Ung, men utrolig dyktig og ryddig — vi visste alltid hva som skjedde. Han hadde full kontroll på både rørlegger og flislegger, og resultatet ble bedre enn vi håpet på.',
    (select id from public.projects where slug = 'leilighet-mohlenpris'),
    true
  ),
  (
    'Linn-Mari S., Sandviken',
    5,
    'Vi drømte om å sette vårt eget preg på et gammelt hus i Sandviken. Lasse skjønte umiddelbart hva vi var ute etter, og tok oss trygt gjennom hele prosessen. Anbefales på det varmeste.',
    (select id from public.projects where slug = 'totalrenovering-sandviken'),
    true
  ),
  (
    'Anders K., investor',
    5,
    'Jeg har brukt Lasse på flere oppussingsprosjekter. Han holder budsjett og frister, og kvaliteten gjør at leilighetene selger raskt. Jobber gjerne med ham igjen.',
    (select id from public.projects where slug = 'flipp-laksevag'),
    true
  ),
  (
    'Marianne T., Fana',
    4,
    'Hele huset ble pusset opp mens vi bodde her, og Lasse holdt det ryddig og forutsigbart hele veien. Veldig fornøyd med både kjøkkenet og badene.',
    (select id from public.projects where slug = 'enebolig-fana'),
    true
  ),
  (
    'Geir og Wenche, Landås',
    5,
    'Lasse er ærlig på hva han gjør selv og hva han henter inn fag på. Det skaper trygghet. Lett å ha med å gjøre, og han svarer alltid på telefonen.',
    (select id from public.projects where slug = 'rekkehus-landas'),
    true
  )
on conflict do nothing;

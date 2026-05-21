-- Seed-data for demo. Skal være idempotent (on conflict do nothing der mulig).
-- Slettes/erstattes når Robert har ekte prosjekter og anmeldelser.
-- Bildene er fra Unsplash (frie å bruke) som plassholdere.

-- =====================================================================
-- Prosjekter
-- =====================================================================

insert into public.projects (slug, title, type, status, address, description, start_date, end_date, is_public, cover_image_url, published_at)
values
  (
    'enebolig-nordnes',
    'Enebolig på Nordnes',
    'nybygg',
    'ferdig',
    'Nordnes, Bergen',
    'Moderne enebolig på 220 m² over to plan. Vi sto for tegning, prosjektering og bygging — fra fundament til ferdig innredet hjem. Materialvalg: lokal furu utvendig, eik innvendig.',
    '2025-02-01',
    '2025-09-15',
    true,
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
    '2025-10-01T10:00:00Z'
  ),
  (
    'totalrenovering-mohlenpris',
    'Totalrenovering på Møhlenpris',
    'totalrenovering',
    'ferdig',
    'Møhlenpris, Bergen',
    'Helhetlig renovering av en sveitservilla fra 1908. Skjult struktur ble fornyet (isolasjon, el, rør, ventilasjon), mens originale paneler, listverk og dører ble bevart og restaurert.',
    '2024-08-01',
    '2025-04-15',
    true,
    'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600&q=80',
    '2025-05-01T10:00:00Z'
  ),
  (
    'flipp-solheimsviken',
    'Flipp-prosjekt i Solheimsviken',
    'flipp',
    'ferdig',
    'Solheimsviken, Bergen',
    'Toroms-leilighet kjøpt på tvangssalg. Total oppussing på 12 uker: nytt bad, nytt kjøkken, gulv, vegger og lys. Solgt 18 % over takst innen tre uker.',
    '2025-01-15',
    '2025-04-10',
    true,
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',
    '2025-05-15T10:00:00Z'
  ),
  (
    'moske-ytre-arna',
    'Moské-renovering i Ytre Arna',
    'moske',
    'ferdig',
    'Ytre Arna, Bergen',
    'Helhetlig fornyelse av eksisterende moské-bygg: nytt tak, etterisolering, nye vinduer, oppgraderte våtrom og fellesarealer. Spesielt fokus på akustikk i bønnerommet.',
    '2024-05-01',
    '2024-12-20',
    true,
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80',
    '2025-01-10T10:00:00Z'
  ),
  (
    'rekkehus-landas',
    'Rekkehus på Landås',
    'rekkehus',
    'pagaende',
    'Landås, Bergen',
    'Pågående rehabilitering av rekkehus fra 80-tallet. Nye fasadeplater, bedre lydskille mot nabo, ny inngangsparti og oppgraderte våtrom. Forventet ferdig sommer 2026.',
    '2026-01-15',
    null,
    true,
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&q=80',
    '2026-02-01T10:00:00Z'
  )
on conflict (slug) do nothing;

-- =====================================================================
-- Prosjektbilder
-- =====================================================================

-- Helper: bruk slug for å slå opp project_id og insert bilder.
-- Vi bruker DO-blokk slik at vi unngår å hardkode UUID-er.

do $$
declare
  rec record;
begin
  -- Enebolig på Nordnes
  for rec in
    select unnest(array[
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80'
    ]) as url
  loop
    insert into public.project_images (project_id, url, sort_order)
    select id, rec.url, row_number() over () from public.projects where slug = 'enebolig-nordnes'
    on conflict do nothing;
  end loop;

  -- Totalrenovering Møhlenpris
  insert into public.project_images (project_id, url, sort_order, is_before)
  select id,
    unnest(array[
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80'
    ]),
    generate_series(1, 2),
    false
  from public.projects where slug = 'totalrenovering-mohlenpris'
  on conflict do nothing;

  -- Flipp Solheimsviken — har før/etter
  insert into public.project_images (project_id, url, sort_order, is_before, is_after)
  values
    ((select id from public.projects where slug = 'flipp-solheimsviken'),
     'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=1600&q=80', 1, true, false),
    ((select id from public.projects where slug = 'flipp-solheimsviken'),
     'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80', 2, false, true),
    ((select id from public.projects where slug = 'flipp-solheimsviken'),
     'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1600&q=80', 3, false, true)
  on conflict do nothing;

  -- Moské Ytre Arna
  insert into public.project_images (project_id, url, sort_order)
  select id,
    unnest(array[
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80',
      'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1600&q=80'
    ]),
    generate_series(1, 2)
  from public.projects where slug = 'moske-ytre-arna'
  on conflict do nothing;

  -- Rekkehus Landås — pågående
  insert into public.project_images (project_id, url, sort_order)
  select id,
    unnest(array[
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80'
    ]),
    generate_series(1, 2)
  from public.projects where slug = 'rekkehus-landas'
  on conflict do nothing;
end $$;

-- =====================================================================
-- Anmeldelser
-- =====================================================================

insert into public.reviews (customer_name, rating, body, project_id, published)
values
  (
    'Eirik H., Nordnes',
    5,
    'Ronny og teamet bygget vår enebolig fra grunnen av. Tett dialog gjennom hele prosessen, materialvalg av høy kvalitet, og overlevert fire dager før avtalt frist. Anbefales på det varmeste.',
    (select id from public.projects where slug = 'enebolig-nordnes'),
    true
  ),
  (
    'Linn-Mari S., Møhlenpris',
    5,
    'Vi var redde for å miste sjarmen i den gamle villaen vår. Tømrer Ronny Osvaag AS klarte å fornye huset uten å ofre detaljene. Resultatet er bedre enn vi hadde turt å håpe på.',
    (select id from public.projects where slug = 'totalrenovering-mohlenpris'),
    true
  ),
  (
    'Anders K., investor',
    5,
    'Profesjonell prosjektledelse på et flipp-prosjekt med stramt budsjett og kort tidsfrist. Solgte 18 % over takst. Jobber gjerne med Ronny igjen.',
    (select id from public.projects where slug = 'flipp-solheimsviken'),
    true
  ),
  (
    'Yusuf A., styreleder',
    5,
    'Vi takker for et utmerket samarbeid på rehabiliteringen av moskeen i Ytre Arna. Faglig dyktige, ryddige og respektfulle gjennom hele prosessen.',
    (select id from public.projects where slug = 'moske-ytre-arna'),
    true
  )
on conflict do nothing;

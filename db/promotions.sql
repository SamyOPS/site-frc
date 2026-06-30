-- Table des promotions affichées dans le bandeau déroulant du hero.
-- À exécuter dans l'éditeur SQL de Supabase.

create table if not exists public.promotions (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  active      boolean not null default true,
  starts_on   date,            -- début de validité (optionnel)
  ends_on     date,            -- fin de validité (optionnel)
  created_at  timestamptz not null default now()
);

create index if not exists promotions_active_idx
  on public.promotions (active, created_at desc);

alter table public.promotions enable row level security;

-- Lecture publique : uniquement les promotions actives.
-- (La fenêtre de validité par dates est filtrée côté application.)
drop policy if exists "promotions_select_active" on public.promotions;
create policy "promotions_select_active"
  on public.promotions for select
  to anon, authenticated
  using (active = true);

-- Administration : accès complet aux profils de rôle "admin".
drop policy if exists "promotions_admin_all" on public.promotions;
create policy "promotions_admin_all"
  on public.promotions for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

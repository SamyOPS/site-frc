-- Table des avis clients (modération avant publication).
-- À exécuter dans l'éditeur SQL de Supabase.

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  quote       text not null,
  rating      smallint not null check (rating between 1 and 5),
  status      text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz not null default now()
);

create index if not exists reviews_status_created_idx
  on public.reviews (status, created_at desc);

alter table public.reviews enable row level security;

-- Lecture publique : uniquement les avis approuvés.
drop policy if exists "reviews_select_approved" on public.reviews;
create policy "reviews_select_approved"
  on public.reviews for select
  to anon, authenticated
  using (status = 'approved');

-- Dépôt public : tout le monde peut soumettre, mais forcément en attente.
drop policy if exists "reviews_insert_pending" on public.reviews;
create policy "reviews_insert_pending"
  on public.reviews for insert
  to anon, authenticated
  with check (status = 'pending');

-- Administration : accès complet aux profils de rôle "admin".
drop policy if exists "reviews_admin_all" on public.reviews;
create policy "reviews_admin_all"
  on public.reviews for all
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

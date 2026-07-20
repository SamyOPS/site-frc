-- Ajout de l'identifiant de série récurrente sur la table des sessions.
-- Permet de regrouper, modifier et supprimer une série de séances d'un coup.
-- À exécuter dans l'éditeur SQL de Supabase (non destructif, idempotent).

alter table public.sessions
  add column if not exists series_id uuid;

create index if not exists sessions_series_idx
  on public.sessions (series_id);

-- Accès public (lecture seule) aux SEULS flyers de promotion, pour l'affichage
-- de la popup sur le site. Les autres documents restent privés.
-- À exécuter dans l'éditeur SQL de Supabase.

-- 1) Table documents : autoriser l'anon à lister uniquement les lignes
--    de catégorie « promotion » (pour récupérer label + file_path).
--    (On n'active/désactive PAS la RLS ici pour ne pas impacter l'accès admin ;
--     cette policy s'ajoute simplement aux policies existantes.)
drop policy if exists "documents_select_promotion" on public.documents;
create policy "documents_select_promotion"
  on public.documents for select
  to anon, authenticated
  using (category = 'promotion');

-- 2) Storage : autoriser l'anon à lire (donc à signer) uniquement les objets
--    du bucket « documents » situés dans le dossier « promotions/ ».
--    Les autres documents (programmes, certificats…) restent inaccessibles.
drop policy if exists "promo_flyers_public_read" on storage.objects;
create policy "promo_flyers_public_read"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = 'promotions'
  );

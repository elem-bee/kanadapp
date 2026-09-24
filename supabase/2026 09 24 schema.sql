-- =============================================================================
-- Compagnon de voyage — schéma Supabase
-- =============================================================================
-- Crée la table clé/valeur `kv` utilisée par index.html, roadbook.html et
-- admin.html, ainsi que ses règles d'accès (RLS).
--
-- Ce script ne contient AUCUNE donnée : il peut être versionné sans risque.
-- Les scripts de données propres à chaque voyage restent hors du dépôt.
--
-- À exécuter une fois dans Supabase ▸ SQL Editor. Il est ré-exécutable sans
-- effet de bord (IF NOT EXISTS / DROP POLICY IF EXISTS).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
-- key        : identifiant de l'entrée (préfixé par voyage côté application)
-- value      : contenu JSON (l'application envoie un objet JSON, pas du texte)
-- updated_at : horodatage envoyé par l'application à chaque écriture
create table if not exists public.kv (
  key        text        primary key,
  value      jsonb,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Sécurité (Row Level Security)
-- -----------------------------------------------------------------------------
-- L'application utilise la clé publique « anon » et lit / écrit / supprime
-- des entrées directement depuis le navigateur (select, upsert, delete).
-- Les mots de passe d'entrée sont vérifiés côté navigateur uniquement : toute
-- personne disposant de l'URL du projet et de la clé anon peut donc lire et
-- modifier la table. C'est le compromis assumé décrit dans le README
-- (usage privé entre voyageurs de confiance).
alter table public.kv enable row level security;

drop policy if exists "kv_select_anon" on public.kv;
drop policy if exists "kv_insert_anon" on public.kv;
drop policy if exists "kv_update_anon" on public.kv;
drop policy if exists "kv_delete_anon" on public.kv;

create policy "kv_select_anon" on public.kv
  for select to anon, authenticated using (true);

create policy "kv_insert_anon" on public.kv
  for insert to anon, authenticated with check (true);

create policy "kv_update_anon" on public.kv
  for update to anon, authenticated using (true) with check (true);

create policy "kv_delete_anon" on public.kv
  for delete to anon, authenticated using (true);

grant select, insert, update, delete on public.kv to anon, authenticated;

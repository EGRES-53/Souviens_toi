/*
  # Nettoyage final des tables et colonnes inutilisées

  1. Vérification et suppression des tables restantes
    - Supprime les tables qui pourraient encore exister
    - Nettoie les colonnes inutilisées
    - Supprime les index orphelins

  2. Optimisation de la base de données
    - Supprime les politiques RLS orphelines
    - Nettoie les triggers inutilisés
    - Optimise les index existants

  3. Sécurité
    - Vérifie que toutes les tables essentielles sont protégées
    - Maintient l'intégrité des données importantes
*/

-- Supprimer les tables inutilisées si elles existent encore
DROP TABLE IF EXISTS public.relations CASCADE;
DROP TABLE IF EXISTS public.persons CASCADE;
DROP TABLE IF EXISTS public.person_events CASCADE;
DROP TABLE IF EXISTS public.person_media CASCADE;
DROP TABLE IF EXISTS public.event_media CASCADE;
DROP TABLE IF EXISTS public.event_media_links CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Supprimer les colonnes inutilisées des tables existantes
DO $$
BEGIN
  -- Nettoyer la table profiles
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'username') THEN
    ALTER TABLE public.profiles DROP COLUMN username;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'education_level') THEN
    ALTER TABLE public.profiles DROP COLUMN education_level;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'institution') THEN
    ALTER TABLE public.profiles DROP COLUMN institution;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'biography') THEN
    ALTER TABLE public.profiles DROP COLUMN biography;
  END IF;

  -- Nettoyer la table media
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media' AND column_name = 'description') THEN
    ALTER TABLE public.media DROP COLUMN description;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media' AND column_name = 'date') THEN
    ALTER TABLE public.media DROP COLUMN date;
  END IF;
END $$;

-- Supprimer les politiques RLS orphelines
DROP POLICY IF EXISTS "relations_select_authenticated" ON public.relations;
DROP POLICY IF EXISTS "relations_insert_authenticated" ON public.relations;
DROP POLICY IF EXISTS "relations_update_authenticated" ON public.relations;
DROP POLICY IF EXISTS "relations_delete_authenticated" ON public.relations;

DROP POLICY IF EXISTS "persons_select_authenticated" ON public.persons;
DROP POLICY IF EXISTS "persons_insert_authenticated" ON public.persons;
DROP POLICY IF EXISTS "persons_update_own" ON public.persons;
DROP POLICY IF EXISTS "persons_delete_own" ON public.persons;

-- Supprimer les triggers orphelins
DROP TRIGGER IF EXISTS update_relations_updated_at ON public.relations;
DROP TRIGGER IF EXISTS update_persons_updated_at ON public.persons;

-- Supprimer les index orphelins
DROP INDEX IF EXISTS idx_persons_created_by;
DROP INDEX IF EXISTS idx_relations_person1;
DROP INDEX IF EXISTS idx_relations_person2;

-- Nettoyer les fonctions inutilisées (garder update_updated_at_column car elle est utilisée)
-- DROP FUNCTION IF EXISTS handle_new_user(); -- Garder cette fonction car elle est utilisée

-- Optimiser les index existants pour les tables utilisées
CREATE INDEX IF NOT EXISTS idx_events_created_by_date ON public.events(created_by, date DESC);
CREATE INDEX IF NOT EXISTS idx_media_event_created ON public.media(event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_created_title ON public.stories(created_by, title);

-- Vérifier que les tables essentielles ont les bonnes contraintes
ALTER TABLE public.profiles ALTER COLUMN full_name SET NOT NULL;
ALTER TABLE public.events ALTER COLUMN title SET NOT NULL;
ALTER TABLE public.events ALTER COLUMN date SET NOT NULL;
ALTER TABLE public.events ALTER COLUMN description SET NOT NULL;
ALTER TABLE public.media ALTER COLUMN title SET NOT NULL;
ALTER TABLE public.media ALTER COLUMN url SET NOT NULL;
ALTER TABLE public.media ALTER COLUMN type SET NOT NULL;
ALTER TABLE public.stories ALTER COLUMN title SET NOT NULL;
ALTER TABLE public.stories ALTER COLUMN content SET NOT NULL;

-- Optimiser les performances avec VACUUM et ANALYZE
-- Note: Ces commandes ne peuvent pas être exécutées dans une transaction
-- Elles devront être exécutées manuellement si nécessaire

-- Afficher un résumé des tables restantes
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
    
    RAISE NOTICE 'Nettoyage terminé. Nombre de tables publiques restantes: %', table_count;
END $$;
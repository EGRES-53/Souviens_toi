/*
  # Mise à jour des politiques de sécurité pour la table events

  1. Modifications
    - Suppression des politiques existantes
    - Création d'une nouvelle politique plus permissive
    - Ajout d'une politique pour l'insertion sans authentification
*/

-- Suppression des politiques existantes
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.events;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.events;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.events;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.events;

-- Création des nouvelles politiques
CREATE POLICY "Enable all access for all users" ON public.events
  FOR ALL
  USING (true)
  WITH CHECK (true);
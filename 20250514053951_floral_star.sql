/*
  # Mise à jour des politiques de sécurité pour la table events

  1. Changements
    - Suppression de toutes les politiques existantes
    - Création d'une nouvelle politique simplifiée
    - Désactivation temporaire de RLS pour debug
*/

-- Désactiver temporairement RLS pour la table events
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Enable all access for all users" ON public.events;

-- Créer une nouvelle politique simple
CREATE POLICY "Public access policy" ON public.events
  FOR ALL
  USING (true)
  WITH CHECK (true);
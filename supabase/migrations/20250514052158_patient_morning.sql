/*
  # Mise à jour des politiques de sécurité pour la table events

  1. Modifications
    - Suppression des anciennes politiques
    - Ajout de nouvelles politiques plus permissives pour les utilisateurs authentifiés
    
  2. Sécurité
    - Les utilisateurs authentifiés peuvent créer des événements
    - Les utilisateurs authentifiés peuvent voir tous les événements
    - Les utilisateurs peuvent modifier leurs propres événements
    - Les utilisateurs peuvent supprimer leurs propres événements
*/

-- Suppression des anciennes politiques
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.events;
DROP POLICY IF EXISTS "Users can update events they created" ON public.events;
DROP POLICY IF EXISTS "Users can delete events they created" ON public.events;

-- Création des nouvelles politiques
CREATE POLICY "Enable read access for authenticated users" ON public.events
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.events
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON public.events
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON public.events
  FOR DELETE
  USING (auth.role() = 'authenticated');
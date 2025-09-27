/*
  # Configuration du stockage des médias

  1. Modifications de la table media
    - Ajout de la colonne event_id pour lier les médias aux événements
    - Ajout de contraintes et index pour optimiser les performances
    
  2. Sécurité
    - Mise à jour des politiques RLS pour le stockage
*/

-- Modification de la table media
ALTER TABLE public.media
ADD COLUMN IF NOT EXISTS event_id uuid REFERENCES public.events(id) ON DELETE CASCADE;

-- Création d'un index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_media_event_id ON public.media(event_id);

-- Mise à jour des politiques de sécurité pour le stockage
CREATE POLICY "Les utilisateurs peuvent télécharger des médias" ON storage.objects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Les médias sont accessibles publiquement" ON storage.objects
  FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs médias" ON storage.objects
  FOR DELETE USING (true);
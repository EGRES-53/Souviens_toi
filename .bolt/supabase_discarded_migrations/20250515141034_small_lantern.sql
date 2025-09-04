-- Désactiver temporairement RLS pour faciliter le débogage
ALTER TABLE public.persons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.media DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.relations DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Enable read access for all users" ON public.persons;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.persons;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.persons;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.persons;

-- Créer une politique simple pour chaque table
CREATE POLICY "Enable all access for all users" ON public.persons
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for all users" ON public.events
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for all users" ON public.media
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for all users" ON public.relations
  FOR ALL USING (true)
  WITH CHECK (true);

-- Réactiver RLS avec les nouvelles politiques
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relations ENABLE ROW LEVEL SECURITY;
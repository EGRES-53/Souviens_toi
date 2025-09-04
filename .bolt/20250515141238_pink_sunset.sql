-- Désactiver RLS sur toutes les tables
ALTER TABLE public.persons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.media DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.relations DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Enable all access for all users" ON public.persons;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.events;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.media;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.relations;

-- Créer des politiques simples qui permettent l'accès complet
CREATE POLICY "Allow full access" ON public.persons FOR ALL USING (true);
CREATE POLICY "Allow full access" ON public.events FOR ALL USING (true);
CREATE POLICY "Allow full access" ON public.media FOR ALL USING (true);
CREATE POLICY "Allow full access" ON public.relations FOR ALL USING (true);

-- Réactiver RLS
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relations ENABLE ROW LEVEL SECURITY;
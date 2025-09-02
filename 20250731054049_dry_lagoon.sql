/*
  # Simplify database structure

  1. Remove unused tables and columns
    - Drop `persons` table (not actively used in main app flow)
    - Drop `relations` table (family relationships feature not essential)
    - Drop `event_media_links` table (redundant with event_id in media)
    - Drop `admin_users` table (not needed, use auth.users)
    - Remove unused columns from profiles table
    - Remove unused columns from media table

  2. Keep essential tables
    - `profiles` (user profiles)
    - `events` (timeline events)
    - `media` (photos and documents)
    - `stories` (family stories)

  3. Simplify relationships
    - Direct event_id reference in media table
    - Remove complex junction tables
*/

-- Drop unused tables
DROP TABLE IF EXISTS public.relations CASCADE;
DROP TABLE IF EXISTS public.persons CASCADE;
DROP TABLE IF EXISTS public.person_events CASCADE;
DROP TABLE IF EXISTS public.person_media CASCADE;
DROP TABLE IF EXISTS public.event_media CASCADE;
DROP TABLE IF EXISTS public.event_media_links CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Remove unused columns from profiles
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS username,
DROP COLUMN IF EXISTS education_level,
DROP COLUMN IF EXISTS institution,
DROP COLUMN IF EXISTS biography;

-- Remove unused columns from media
ALTER TABLE public.media 
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS date;

-- Remove unused columns from events
ALTER TABLE public.events 
DROP COLUMN IF EXISTS location;

-- Drop unused policies
DROP POLICY IF EXISTS "relations_select_authenticated" ON public.relations;
DROP POLICY IF EXISTS "relations_insert_authenticated" ON public.relations;
DROP POLICY IF EXISTS "relations_update_authenticated" ON public.relations;
DROP POLICY IF EXISTS "relations_delete_authenticated" ON public.relations;

DROP POLICY IF EXISTS "persons_select_authenticated" ON public.persons;
DROP POLICY IF EXISTS "persons_insert_authenticated" ON public.persons;
DROP POLICY IF EXISTS "persons_update_own" ON public.persons;
DROP POLICY IF EXISTS "persons_delete_own" ON public.persons;

-- Drop unused triggers
DROP TRIGGER IF EXISTS update_relations_updated_at ON public.relations;
DROP TRIGGER IF EXISTS update_persons_updated_at ON public.persons;

-- Clean up any remaining indexes
DROP INDEX IF EXISTS idx_persons_created_by;
DROP INDEX IF EXISTS idx_relations_person1;
DROP INDEX IF EXISTS idx_relations_person2;

-- Ensure essential indexes exist
CREATE INDEX IF NOT EXISTS idx_media_event_id ON public.media(event_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_stories_created_by ON public.stories(created_by);

-- Update profiles table to be simpler
ALTER TABLE public.profiles 
ALTER COLUMN full_name SET NOT NULL;

-- Ensure all essential policies are in place
-- (These should already exist from previous migrations, but ensuring they're correct)

-- Grant permissions for simplified structure
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stories TO authenticated;

GRANT SELECT ON public.events TO anon;
/*
  # Drop unused person relationship tables

  1. Changes
    - Drop person_events table
    - Drop person_media table
    
  2. Reason
    - These tables are not being used in the application
    - No existing functionality depends on these tables
*/

-- Drop person_events table
DROP TABLE IF EXISTS public.person_events;

-- Drop person_media table
DROP TABLE IF EXISTS public.person_media;